import type { ServerOptionsProps } from '@/components/ui/LoadMoreSentinel/LoadMoreSentinel.types';
import type { ReactNode } from 'react';

export type ComboBoxOption = {
    value: string;
    label: ReactNode;
    [key: string]: unknown;
};

export type ComboBoxProps = ServerOptionsProps & {
    options: ComboBoxOption[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    /** Accessible name of the trigger when there is no visible label. */
    'aria-label'?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    notFoundText?: string;
    required?: boolean;
    disabled?: boolean;
    isPending?: boolean;
    isError?: boolean;
    error?: string;
    className?: string;
};
