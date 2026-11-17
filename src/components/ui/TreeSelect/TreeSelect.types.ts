import type { CheckState, TreeOption } from './utils/tree/tree';

export type TreeSelectProps = {
    options: TreeOption[];
    /** Selected leaf values; a parent counts as selected when all its leaves are. */
    selected: string[];
    onChange?: (values: string[]) => void;
    /** Checkboxes with cascading parents (default), or a single leaf. */
    multiple?: boolean;
    /** Parents expanded when the popover first opens, or 'all'. */
    defaultExpanded?: string[] | 'all';
    label?: string;
    description?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    notFoundText?: string;
    required?: boolean;
    disabled?: boolean;
    /** The options are loading (e.g. from a server); the trigger is disabled. */
    isPending?: boolean;
    /** The options failed to load; the trigger is disabled. */
    isError?: boolean;
    loadingText?: string;
    errorText?: string;
    error?: string;
    hideSelectedBadges?: boolean;
    className?: string;
};

export type TreeSelectNodeProps = {
    option: TreeOption;
    level: number;
    multiple: boolean;
    isExpanded: (option: TreeOption) => boolean;
    onExpandedChange: (option: TreeOption, expanded: boolean) => void;
    checkState: (option: TreeOption) => CheckState;
    onSelect: (option: TreeOption) => void;
};
