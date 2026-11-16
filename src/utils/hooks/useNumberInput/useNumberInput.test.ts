import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { useNumberInput, type UseNumberInputOptions } from '.';

function changeEvent(value: string, caret = value.length) {
    return {
        target: { value, selectionStart: caret },
    } as unknown as ChangeEvent<HTMLInputElement>;
}

function keyEvent(key: string) {
    let prevented = false;
    return {
        key,
        get defaultPrevented() {
            return prevented;
        },
        preventDefault: () => {
            prevented = true;
        },
        currentTarget: {
            value: '',
            selectionStart: 0,
            selectionEnd: 0,
            setSelectionRange: vi.fn(),
        },
    } as unknown as KeyboardEvent<HTMLInputElement>;
}

const blurEvent = {} as FocusEvent<HTMLInputElement>;

function setup(options: UseNumberInputOptions = {}) {
    return renderHook((props: UseNumberInputOptions) => useNumberInput(props), {
        initialProps: options,
    });
}

describe('useNumberInput — state', () => {
    it('starts empty by default', () => {
        const { result } = setup();
        expect(result.current.value).toBeNull();
        expect(result.current.inputValue).toBe('');
    });

    it('formats the default value', () => {
        const { result } = setup({
            defaultValue: 1234.5,
            thousandSeparator: ',',
        });
        expect(result.current.value).toBe(1234.5);
        expect(result.current.inputValue).toBe('1,234.5');
    });

    it('updates the value and text while typing (uncontrolled)', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ thousandSeparator: ',', onValueChange });

        act(() => result.current.onChange(changeEvent('12345')));

        expect(result.current.value).toBe(12345);
        expect(result.current.inputValue).toBe('12,345');
        expect(onValueChange).toHaveBeenCalledWith(12345);
    });

    it('keeps partial input without reporting a value', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ onValueChange });

        act(() => result.current.onChange(changeEvent('-')));

        expect(result.current.inputValue).toBe('-');
        expect(result.current.value).toBeNull();
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not report a change when the number stays the same', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ defaultValue: 12, onValueChange });

        act(() => result.current.onChange(changeEvent('12.')));

        expect(result.current.inputValue).toBe('12.');
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('reports null when the input is cleared', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ defaultValue: 5, onValueChange });

        act(() => result.current.onChange(changeEvent('')));

        expect(result.current.value).toBeNull();
        expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it('follows a controlled value', () => {
        const { result, rerender } = setup({ value: 10 });
        expect(result.current.inputValue).toBe('10');

        rerender({ value: 2000, thousandSeparator: ',' });
        expect(result.current.inputValue).toBe('2,000');

        rerender({ value: null });
        expect(result.current.inputValue).toBe('');
    });

    it('does not change a controlled value on its own', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ value: 10, onValueChange });

        act(() => result.current.onChange(changeEvent('105')));

        expect(onValueChange).toHaveBeenCalledWith(105);
        expect(result.current.value).toBe(10);
    });

    it('keeps the typed text when the controlled value catches up', () => {
        const { result, rerender } = setup({ value: 1 });

        act(() => result.current.onChange(changeEvent('1.')));
        rerender({ value: 1 });

        expect(result.current.inputValue).toBe('1.');
    });

    it('respects allowNegative and decimalScale', () => {
        const { result } = setup({ allowNegative: false, decimalScale: 1 });

        act(() => result.current.onChange(changeEvent('-1.25')));

        expect(result.current.inputValue).toBe('1.2');
        expect(result.current.value).toBe(1.2);
    });

    it('disallows negatives by default when min is not negative', () => {
        const { result } = setup({ min: 0 });

        act(() => result.current.onChange(changeEvent('-3')));

        expect(result.current.value).toBe(3);
    });
});

describe('useNumberInput — stepping', () => {
    it('increments and decrements by step', () => {
        const { result } = setup({ defaultValue: 1, step: 0.1 });

        act(() => result.current.increment());
        expect(result.current.value).toBe(1.1);

        act(() => result.current.decrement());
        act(() => result.current.decrement());
        expect(result.current.value).toBe(0.9);
    });

    it('steps from zero when empty, clamped to min', () => {
        const { result } = setup({ min: 5 });

        act(() => result.current.increment());

        expect(result.current.value).toBe(5);
        expect(result.current.inputValue).toBe('5');
    });

    it('clamps stepping to max', () => {
        const { result } = setup({ defaultValue: 9, max: 10, step: 5 });

        act(() => result.current.increment());

        expect(result.current.value).toBe(10);
    });

    it('steps with arrow and page keys', () => {
        const { result } = setup({ defaultValue: 0, step: 2 });

        const up = keyEvent('ArrowUp');
        act(() => result.current.onKeyDown(up));
        expect(result.current.value).toBe(2);
        expect(up.defaultPrevented).toBe(true);

        act(() => result.current.onKeyDown(keyEvent('PageUp')));
        expect(result.current.value).toBe(22);

        act(() => result.current.onKeyDown(keyEvent('ArrowDown')));
        act(() => result.current.onKeyDown(keyEvent('PageDown')));
        expect(result.current.value).toBe(0);
    });

    it('lets a custom onKeyDown cancel stepping', () => {
        const { result } = setup({
            defaultValue: 1,
            onKeyDown: (event) => event.preventDefault(),
        });

        act(() => result.current.onKeyDown(keyEvent('ArrowUp')));

        expect(result.current.value).toBe(1);
    });

    it('does not step when disabled or read-only', () => {
        const disabled = setup({ defaultValue: 1, disabled: true });
        act(() => disabled.result.current.increment());
        expect(disabled.result.current.value).toBe(1);
        expect(disabled.result.current.canIncrement).toBe(false);

        const readOnly = setup({ defaultValue: 1, readOnly: true });
        act(() => readOnly.result.current.decrement());
        expect(readOnly.result.current.value).toBe(1);
        expect(readOnly.result.current.canDecrement).toBe(false);
    });

    it('reports whether stepping is possible at the bounds', () => {
        const { result, rerender } = setup({ value: 10, min: 0, max: 10 });
        expect(result.current.canIncrement).toBe(false);
        expect(result.current.canDecrement).toBe(true);

        rerender({ value: 0, min: 0, max: 10 });
        expect(result.current.canDecrement).toBe(false);

        rerender({ value: null, min: 0, max: 10 });
        expect(result.current.canIncrement).toBe(true);
        expect(result.current.canDecrement).toBe(true);
    });
});

describe('useNumberInput — blur', () => {
    it('clamps to min and max on blur', () => {
        const onValueChange = vi.fn();
        const { result } = setup({ min: 10, max: 20, onValueChange });

        act(() => result.current.onChange(changeEvent('5')));
        act(() => result.current.onBlur(blurEvent));
        expect(result.current.value).toBe(10);

        act(() => result.current.onChange(changeEvent('50')));
        act(() => result.current.onBlur(blurEvent));
        expect(result.current.value).toBe(20);
        expect(onValueChange).toHaveBeenLastCalledWith(20);
    });

    it('applies fixedDecimalScale and clears partial input on blur', () => {
        const { result } = setup({ decimalScale: 2, fixedDecimalScale: true });

        act(() => result.current.onChange(changeEvent('1.5')));
        expect(result.current.inputValue).toBe('1.5');
        act(() => result.current.onBlur(blurEvent));
        expect(result.current.inputValue).toBe('1.50');

        act(() => result.current.onChange(changeEvent('-')));
        act(() => result.current.onBlur(blurEvent));
        expect(result.current.inputValue).toBe('');
    });

    it('calls a custom onBlur', () => {
        const onBlur = vi.fn();
        const { result } = setup({ onBlur });

        act(() => result.current.onBlur(blurEvent));

        expect(onBlur).toHaveBeenCalledWith(blurEvent);
    });
});

describe('useNumberInput — refs and separators', () => {
    it('forwards the input node to a callback ref and an object ref', () => {
        const callbackRef = vi.fn();
        const objectRef = { current: null as HTMLInputElement | null };
        const node = document.createElement('input');

        const callback = setup({ ref: callbackRef });
        act(() => callback.result.current.inputRef(node));
        expect(callbackRef).toHaveBeenCalledWith(node);

        const object = setup({ ref: objectRef });
        act(() => object.result.current.inputRef(node));
        expect(objectRef.current).toBe(node);
    });

    it('moves the caret over a separator on Backspace and Delete', () => {
        const { result } = setup({ thousandSeparator: ',' });

        const backspace = keyEvent('Backspace');
        Object.assign(backspace.currentTarget, {
            value: '1,234',
            selectionStart: 2,
            selectionEnd: 2,
        });
        result.current.onKeyDown(backspace);
        expect(backspace.currentTarget.setSelectionRange).toHaveBeenCalledWith(
            1,
            1,
        );

        const del = keyEvent('Delete');
        Object.assign(del.currentTarget, {
            value: '1,234',
            selectionStart: 1,
            selectionEnd: 1,
        });
        result.current.onKeyDown(del);
        expect(del.currentTarget.setSelectionRange).toHaveBeenCalledWith(2, 2);
    });

    it('leaves the caret alone away from separators or with a selection', () => {
        const { result } = setup({ thousandSeparator: ',' });

        const backspace = keyEvent('Backspace');
        Object.assign(backspace.currentTarget, {
            value: '1,234',
            selectionStart: 4,
            selectionEnd: 4,
        });
        result.current.onKeyDown(backspace);

        const selection = keyEvent('Delete');
        Object.assign(selection.currentTarget, {
            value: '1,234',
            selectionStart: 1,
            selectionEnd: 3,
        });
        result.current.onKeyDown(selection);

        expect(
            backspace.currentTarget.setSelectionRange,
        ).not.toHaveBeenCalled();
        expect(
            selection.currentTarget.setSelectionRange,
        ).not.toHaveBeenCalled();
    });
});
