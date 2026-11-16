'use client';

import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import { cn } from '@/utils/funcs/cn';
import { useId } from 'react';
import { InputComponent } from './components';
import type { InputProps } from './Input.types';

const Input = ({
    label,
    description,
    hint,
    error,
    required,
    startAddon,
    endAddon,
    action,
    id,
    className,
    ...props
}: InputProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasAddon = startAddon || endAddon;
    const isInvalid = !!error;

    return (
        <Field data-invalid={isInvalid || undefined} className="relative pb-1">
            {label && (
                <FieldLabel
                    htmlFor={inputId}
                    required={required}
                    className="text-foreground"
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className="text-muted-foreground">
                    {description}
                </FieldDescription>
            )}
            {!hasAddon && !action && (
                <InputComponent
                    id={inputId}
                    aria-invalid={isInvalid || undefined}
                    className={className}
                    {...props}
                />
            )}

            {!hasAddon && action && (
                <div className="flex items-stretch *:h-9 *:focus-visible:relative *:focus-visible:z-10 [&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-0 [&>*:not(:last-child)]:rounded-e-none">
                    <InputComponent
                        id={inputId}
                        aria-invalid={isInvalid || undefined}
                        className={cn('flex-1', className)}
                        {...props}
                    />
                    {action}
                </div>
            )}

            {hasAddon && (
                <div
                    className={cn(
                        'flex h-9 w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow,border]',
                        // Mirrors InputComponent's disabled state for the whole group.
                        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
                        isInvalid
                            ? 'border-destructive has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-destructive/50'
                            : 'border-input/50 has-[input:enabled]:hover:border-primary has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/50',
                    )}
                >
                    {startAddon && (
                        <div className="flex items-center border-e border-input/50 ps-2.5 pe-2 text-sm text-muted-foreground">
                            {startAddon}
                        </div>
                    )}
                    <InputComponent
                        id={inputId}
                        className={cn(
                            'h-auto flex-1 rounded-none border-0 shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:opacity-100 aria-invalid:border-0 aria-invalid:ring-0 aria-invalid:focus-visible:ring-0',
                            className,
                        )}
                        {...props}
                    />
                    {endAddon && (
                        <div className="flex items-center border-s border-input/50 ps-2 pe-2.5 text-sm text-muted-foreground">
                            {endAddon}
                        </div>
                    )}
                </div>
            )}

            {/* Rendered even while empty (e.g. a value-based hint before any
                input) so the line is reserved and the layout doesn't shift. */}
            {hint !== undefined && hint !== null && hint !== false && (
                <FieldDescription
                    data-slot="input-hint"
                    dir="auto"
                    className="min-h-lh text-muted-foreground"
                >
                    {hint}
                </FieldDescription>
            )}

            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default Input;
