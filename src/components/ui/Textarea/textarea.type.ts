import { ComponentProps } from "react";

export type TextareaProps = ComponentProps<'textarea'> & {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    description?: string;
    error?: string;
};

