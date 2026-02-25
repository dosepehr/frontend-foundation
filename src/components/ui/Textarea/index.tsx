import { cn } from '@/utils/funcs/cn';
import * as React from 'react';
import { Field, FieldDescription, FieldLabel } from '../Field';
import { TextareaProps } from './textarea.type';

function Textarea({
    className,
    label,
    id,
    disabled,
    required,
    description,
    error,
    ...props
}: TextareaProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id} required={required} disabled={disabled}>
                {label}
            </FieldLabel>
            <textarea
                id={id}
                disabled={disabled}
                data-slot='textarea'
                aria-invalid={!!error}
                className={cn(
                    'dark:bg-input/30 border-input focus-visible:border-primary focus-visible:outline-1 focus-visible:outline-primary/40 hover:border-ring aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs md:text-sm placeholder:text-muted-foreground w-full min-w-0 field-sizing-content min-h-16 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow,border-color]',
                    className
                )}
                {...props}
            />
            <FieldDescription>{description}</FieldDescription>
        </Field>
    );
}

export { Textarea };

