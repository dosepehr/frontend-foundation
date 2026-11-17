import { act, renderHook } from '@testing-library/react';
import { formatDateRange, useDateRangePicker } from '.';

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

describe('formatDateRange', () => {
    it('formats both ends', () => {
        expect(formatDateRange({ from: JAN_5, to: JAN_9 }, 'LLL d')).toBe(
            'Jan 5 – Jan 9',
        );
    });

    it('marks an open end', () => {
        expect(formatDateRange({ from: JAN_5, to: undefined }, 'LLL d')).toBe(
            'Jan 5 – …',
        );
    });

    it('returns an empty string without a start', () => {
        expect(formatDateRange(undefined, 'LLL d')).toBe('');
        expect(formatDateRange({ from: undefined }, 'LLL d')).toBe('');
    });
});

describe('useDateRangePicker', () => {
    it('closes after the second pick of a complete range', () => {
        const onChange = vi.fn();
        const { result } = renderHook(() => useDateRangePicker({ onChange }));

        act(() => result.current.setOpen(true));
        act(() => result.current.select({ from: JAN_5, to: JAN_5 }));
        expect(result.current.open).toBe(true);

        act(() => result.current.select({ from: JAN_5, to: JAN_9 }));
        expect(result.current.open).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('restarts counting when reopened', () => {
        const { result } = renderHook(() => useDateRangePicker({}));

        act(() => result.current.setOpen(true));
        act(() => result.current.select({ from: JAN_5, to: JAN_5 }));
        act(() => result.current.setOpen(false));
        act(() => result.current.setOpen(true));
        act(() => result.current.select({ from: JAN_5, to: JAN_9 }));

        expect(result.current.open).toBe(true);
    });

    it('stays open after clearing the range', () => {
        const { result } = renderHook(() => useDateRangePicker({}));

        act(() => result.current.setOpen(true));
        act(() => result.current.select({ from: JAN_5, to: JAN_5 }));
        act(() => result.current.select());

        expect(result.current.open).toBe(true);
    });

    it('labels the value', () => {
        const { result } = renderHook(() =>
            useDateRangePicker({
                value: { from: JAN_5, to: JAN_9 },
                format: 'd/M',
            }),
        );
        expect(result.current.label).toBe('5/1 – 9/1');
    });
});
