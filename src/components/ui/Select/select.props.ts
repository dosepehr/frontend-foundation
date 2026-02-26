type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type SelectFieldProps = {
    id?: string;
    label?: string;
    description?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'default';
    className?: string;
};

