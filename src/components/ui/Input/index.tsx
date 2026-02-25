import { cn } from '@/utils/funcs/cn';
import * as React from 'react';
import { InputProps } from './input.type';
import { Field, FieldLabel } from '../Field';

function Input({
    className,
    type = 'text',
    label,
    id,
    disabled,
    required,
    icon,
    description,
    ...props
}: React.ComponentProps<'input'> & InputProps) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <input
                type={type}
                id={id}
                data-slot='input'
                className={cn(
                    'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        </Field>
    );
}

export { Input };

