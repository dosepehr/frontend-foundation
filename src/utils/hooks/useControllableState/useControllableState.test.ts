import { act, renderHook } from '@testing-library/react';
import { useControllableState, type UseControllableStateOptions } from '.';

function setup<T>(options: UseControllableStateOptions<T>) {
    return renderHook(
        (props: UseControllableStateOptions<T>) => useControllableState(props),
        { initialProps: options },
    );
}

describe('useControllableState', () => {
    it('starts from the default value when uncontrolled', () => {
        const { result } = setup({ defaultValue: 'a' });
        expect(result.current[0]).toBe('a');
    });

    it('updates internally and reports changes when uncontrolled', () => {
        const onChange = vi.fn();
        const { result } = setup({ defaultValue: 1, onChange });

        act(() => result.current[1](2));

        expect(result.current[0]).toBe(2);
        expect(onChange).toHaveBeenCalledWith(2);
    });

    it('follows the controlled value and only reports changes', () => {
        const onChange = vi.fn();
        const { result, rerender } = setup({
            value: 'x',
            defaultValue: '',
            onChange,
        });

        act(() => result.current[1]('y'));
        expect(result.current[0]).toBe('x');
        expect(onChange).toHaveBeenCalledWith('y');

        rerender({ value: 'y', defaultValue: '', onChange });
        expect(result.current[0]).toBe('y');
    });

    it('skips unchanged values', () => {
        const onChange = vi.fn();
        const { result } = setup({ defaultValue: 5, onChange });

        act(() => result.current[1](5));

        expect(onChange).not.toHaveBeenCalled();
    });

    it('treats null as a controlled value', () => {
        const { result } = setup<string | null>({
            value: null,
            defaultValue: 'default',
        });
        expect(result.current[0]).toBeNull();
    });
});
