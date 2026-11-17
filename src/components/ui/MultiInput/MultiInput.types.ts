export type MultiInputProps = {
    value?: string[];
    onChange?: (values: string[]) => void;

    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    /** Maximum length of a single item. */
    maxLength?: number;
    /** Maximum number of items; further items are ignored. */
    maxItems?: number;
    /**
     * Keys that add the typed item. Single characters also split pasted
     * text, and new lines always do.
     */
    separators?: string[];
    /** Adds the typed item when the input loses focus. */
    addOnBlur?: boolean;
    className?: string;
};
