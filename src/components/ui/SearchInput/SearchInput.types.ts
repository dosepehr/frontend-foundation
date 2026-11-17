import type { InputProps } from '@/components/ui/Input/Input.types';

export type SearchInputProps = Omit<
    InputProps,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'startAddon' | 'endAddon'
> & {
    value?: string;
    defaultValue?: string;
    /** Called on every keystroke. */
    onValueChange?: (value: string) => void;
    /** Called `debounceMs` after typing stops, on Enter and on clear. */
    onSearch?: (value: string) => void;
    debounceMs?: number;
    /** Shows a spinner in place of the clear button. */
    isLoading?: boolean;
    /** Accessible name of the end button while there is text (it clears). */
    clearLabel?: string;
    /** Accessible name of the end button while empty (it focuses the box). */
    searchLabel?: string;
    /** Converts Persian and Arabic-Indic digits to Latin while typing. */
    normalizeDigits?: boolean;
};
