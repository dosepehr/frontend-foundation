import { cn } from '@/utils/funcs/cn';
import * as React from 'react';
import { InputProps } from './input.type';
import { Field, FieldDescription, FieldLabel } from '../Field';

function Input({
    className,
    type = 'text',
    label,
    id,
    disabled,
    required,
    description,
    error,
    ...props
}: React.ComponentProps<'input'> & InputProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id} required={required} disabled={disabled}>
                {label}
            </FieldLabel>
            <input
                type={type}
                id={id}
                disabled={disabled}
                data-slot='input'
                aria-invalid={!!error}
                className={cn(
                    'dark:bg-input/30 border-input focus-visible:border-primary focus-visible:outline-1 focus-visible:outline-primary/40 hover:border-ring aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs file:h-7 file:text-sm file:font-medium md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow,border-color]',
                    className
                )}
                {...props}
            />
            <FieldDescription>{description}</FieldDescription>
        </Field>
    );
}

export { Input };

