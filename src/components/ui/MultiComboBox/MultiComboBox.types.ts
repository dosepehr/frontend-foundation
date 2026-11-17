import type { ServerOptionsProps } from '@/components/ui/LoadMoreSentinel/LoadMoreSentinel.types';
export type MultiComboBoxOption = {
    value: string;
    label: string;
    [key: string]: unknown;
};

export type MultiComboBoxProps = ServerOptionsProps & {
    options: MultiComboBoxOption[];
    selected: string[];
    onChange?: (values: string[]) => void;

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

    hideSelectedBadges?: boolean;
    className?: string;
};
