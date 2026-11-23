import { act, renderHook } from '@testing-library/react';
import { useSeriesVisibility } from '.';

const KEYS = ['a', 'b', 'c'];

describe('useSeriesVisibility', () => {
    it('shows every series at first', () => {
        const { result } = renderHook(() => useSeriesVisibility(KEYS));
        expect(result.current.visibleKeys).toEqual(KEYS);
    });

    it('hides and shows a series', () => {
        const { result } = renderHook(() => useSeriesVisibility(KEYS));
        act(() => result.current.toggle('b'));
        expect(result.current.hidden.has('b')).toBe(true);
        expect(result.current.visibleKeys).toEqual(['a', 'c']);
        act(() => result.current.toggle('b'));
        expect(result.current.visibleKeys).toEqual(KEYS);
    });

    it('keeps the last visible series', () => {
        const { result } = renderHook(() =>
            useSeriesVisibility(KEYS, ['a', 'b']),
        );
        act(() => result.current.toggle('c'));
        expect(result.current.visibleKeys).toEqual(['c']);
    });
});
