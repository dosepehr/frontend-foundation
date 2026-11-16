'use client';

import type { NumberFormatOptions } from '@/utils/funcs/numberFormat';
import {
    addStep,
    caretFromEnd,
    clampNumber,
    countSignificantAfter,
    formatNumber,
    formatNumberString,
    parseNumber,
    sanitizeNumber,
} from '@/utils/funcs/numberFormat';
import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
    type Ref,
} from 'react';

export type UseNumberInputOptions = NumberFormatOptions & {
    /** Controlled value; `null` means empty. */
    value?: number | null;
    defaultValue?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    /** Amount added by the arrow keys and stepper buttons. */
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    ref?: Ref<HTMLInputElement>;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

type Display = { text: string; caret: number | null };

const PAGE_MULTIPLIER = 10;

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
}

/**
 * State and handlers for a text input that edits a number: sanitizes typing,
 * groups thousands while keeping the caret in place, steps with the arrow
 * keys and clamps to `min`/`max` on blur.
 */
export function useNumberInput({
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    step = 1,
    thousandSeparator = '',
    decimalScale,
    fixedDecimalScale = false,
    allowNegative = min === undefined || min < 0,
    disabled = false,
    readOnly = false,
    ref,
    onBlur,
    onKeyDown,
}: UseNumberInputOptions) {
    const format = { thousandSeparator, decimalScale, fixedDecimalScale };
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const current = isControlled ? value : internalValue;

    const [display, setDisplay] = useState<Display>(() => ({
        text: formatNumber(current, format),
        caret: null,
    }));
    const [syncedValue, setSyncedValue] = useState(current);

    // Rewrite the text when the value changes from outside (controlled
    // updates, stepping), but not while it already matches what was typed.
    if (!Object.is(current, syncedValue)) {
        setSyncedValue(current);
        if (parseNumber(display.text) !== current) {
            setDisplay({ text: formatNumber(current, format), caret: null });
        }
    }

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRef = useCallback(
        (node: HTMLInputElement | null) => {
            inputRef.current = node;
            assignRef(ref, node);
        },
        [ref],
    );

    useLayoutEffect(() => {
        const input = inputRef.current;
        if (display.caret === null || !input) return;
        if (input.ownerDocument.activeElement !== input) return;
        input.setSelectionRange(display.caret, display.caret);
    }, [display]);

    const commit = (next: number | null) => {
        if (Object.is(next, current)) return;
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
    };

    const stepBy = (delta: number) => {
        if (disabled || readOnly) return;
        const next = clampNumber(addStep(current ?? 0, delta), min, max);
        setDisplay({ text: formatNumber(next, format), caret: null });
        commit(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        const caret = event.target.selectionStart ?? raw.length;
        const clean = sanitizeNumber(raw, { allowNegative, decimalScale });
        const text = formatNumberString(clean, thousandSeparator);

        setDisplay({
            text,
            caret: caretFromEnd(text, countSignificantAfter(raw, caret)),
        });
        commit(parseNumber(clean));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        const deltas: Record<string, number> = {
            ArrowUp: step,
            ArrowDown: -step,
            PageUp: step * PAGE_MULTIPLIER,
            PageDown: -step * PAGE_MULTIPLIER,
        };
        if (event.key in deltas) {
            event.preventDefault();
            stepBy(deltas[event.key]);
            return;
        }

        // Deleting next to a separator removes the digit behind it instead,
        // otherwise regrouping would put the separator straight back.
        const input = event.currentTarget;
        const { selectionStart: start, selectionEnd: end } = input;
        if (!thousandSeparator || start === null || start !== end) return;
        const size = thousandSeparator.length;
        if (
            event.key === 'Backspace' &&
            input.value.slice(start - size, start) === thousandSeparator
        ) {
            input.setSelectionRange(start - size, start - size);
        } else if (
            event.key === 'Delete' &&
            input.value.slice(start, start + size) === thousandSeparator
        ) {
            input.setSelectionRange(start + size, start + size);
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const next = current === null ? null : clampNumber(current, min, max);
        setDisplay({ text: formatNumber(next, format), caret: null });
        commit(next);
        onBlur?.(event);
    };

    const isEditable = !disabled && !readOnly;

    return {
        inputRef: setRef,
        value: current,
        inputValue: display.text,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        increment: () => stepBy(step),
        decrement: () => stepBy(-step),
        canIncrement:
            isEditable &&
            (max === undefined || current === null || current < max),
        canDecrement:
            isEditable &&
            (min === undefined || current === null || current > min),
    };
}
