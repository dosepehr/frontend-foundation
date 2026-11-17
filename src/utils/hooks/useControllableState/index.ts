'use client';

import { useCallback, useState } from 'react';

export type UseControllableStateOptions<T> = {
    /** Controlled value; `undefined` makes the state uncontrolled. */
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
};

/**
 * State that is controlled when `value` is passed and internal otherwise.
 * The setter always reports through `onChange`, and skips unchanged values.
 */
export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
}: UseControllableStateOptions<T>) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internalValue;

    const setValue = useCallback(
        (next: T) => {
            if (Object.is(next, current)) return;
            if (!isControlled) setInternalValue(next);
            onChange?.(next);
        },
        [current, isControlled, onChange],
    );

    return [current, setValue] as const;
}
