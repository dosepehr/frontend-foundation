import type { ComponentProps, ReactNode } from 'react';

export type InputComponentProps = ComponentProps<'input'>;

export type InputProps = InputComponentProps & {
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    action?: ReactNode;
};
