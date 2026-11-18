import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FocusEvent } from 'react';
import { useMobileInput } from './useMobileInput';

const change = (value: string) =>
    ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const blur = {} as FocusEvent<HTMLInputElement>;

describe('useMobileInput', () => {
    it('formats and normalizes the default value', () => {
        const { result } = renderHook(() =>
            useMobileInput({ defaultValue: '+989121234567' }),
        );
        expect(result.current.value).toBe('09121234567');
        expect(result.current.display).toBe('0912 123 4567');
    });

    it('keeps the typed text while reporting the normalized value', () => {
        const onValueChange = vi.fn();
        const { result } = renderHook(() => useMobileInput({ onValueChange }));

        act(() => result.current.handleChange(change('+98 912')));

        expect(result.current.display).toBe('+98 912');
        expect(result.current.value).toBe('0912');
        expect(onValueChange).toHaveBeenLastCalledWith('0912');
    });

    it('keeps a bare +98 prefix on screen', () => {
        const { result } = renderHook(() => useMobileInput({}));

        act(() => result.current.handleChange(change('+98')));

        expect(result.current.display).toBe('+98');
        expect(result.current.value).toBe('');
    });

    it('regroups the value on blur and calls onBlur', () => {
        const onBlur = vi.fn();
        const { result } = renderHook(() => useMobileInput({ onBlur }));

        act(() => result.current.handleChange(change('۰۰۹۸۹۱۲۱۲۳۴۵۶۷')));
        act(() => result.current.handleBlur(blur));

        expect(result.current.display).toBe('0912 123 4567');
        expect(onBlur).toHaveBeenCalledWith(blur);
    });

    it('uses a custom separator', () => {
        const { result } = renderHook(() =>
            useMobileInput({ defaultValue: '09121234567', separator: '-' }),
        );
        expect(result.current.display).toBe('0912-123-4567');
    });

    it('shows a value set from outside', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useMobileInput({ value }),
            { initialProps: { value: '0912' } },
        );

        rerender({ value: '' });
        expect(result.current.display).toBe('');

        rerender({ value: '09351234567' });
        expect(result.current.display).toBe('0935 123 4567');
    });
});
