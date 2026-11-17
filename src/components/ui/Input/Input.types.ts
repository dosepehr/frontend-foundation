import type { ComponentProps, ReactNode } from 'react';

export type InputComponentProps = ComponentProps<'input'>;

export type InputProps = InputComponentProps & {
    label?: string;
    /** Shown above the input, under the label. */
    description?: string;
    /** Shown under the input, above the error. */
    hint?: ReactNode;
    error?: string;
    /** Marks the field invalid without a message, e.g. when a parent shows the error. */
    invalid?: boolean;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    action?: ReactNode;
};
