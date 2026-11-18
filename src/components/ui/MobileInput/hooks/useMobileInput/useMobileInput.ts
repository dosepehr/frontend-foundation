'use client';

import { useControllableState } from '@/utils/hooks/useControllableState';
import { useState, type ChangeEvent, type FocusEvent } from 'react';
import {
    formatMobile,
    normalizeMobile,
    sanitizeMobileText,
} from '../../utils/mobile/mobile';

export type UseMobileInputOptions = {
    /** Controlled value, normalized as `09xxxxxxxxx`; '' means empty. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Shown between the digit groups once the input loses focus. */
    separator?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

/**
 * Keeps what the user typed on screen (e.g. a `+98` prefix in progress)
 * while reporting the normalized number, and regroups it on blur.
 */
export function useMobileInput({
    value: valueProp,
    defaultValue = '',
    onValueChange,
    separator = ' ',
    onBlur,
}: UseMobileInputOptions) {
    const [value, setValue] = useControllableState({
        value: valueProp,
        defaultValue: normalizeMobile(defaultValue),
        onChange: onValueChange,
    });
    const [text, setText] = useState(() => formatMobile(value, separator));

    // The typed text wins while it still means the current value; a value
    // set from outside (a form reset) replaces it.
    const display =
        normalizeMobile(text) === value ? text : formatMobile(value, separator);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = sanitizeMobileText(event.target.value);
        setText(next);
        setValue(normalizeMobile(next));
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setText(formatMobile(value, separator));
        onBlur?.(event);
    };

    return { value, display, handleChange, handleBlur };
}
