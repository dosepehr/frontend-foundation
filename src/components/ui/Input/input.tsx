'use client'

import { useId } from 'react'
import { cn } from '@/src/utils/funcs/cn'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field'
import type { ComponentProps } from 'react'
import type { InputWrapperProps } from './input.type'

function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot='input'
            className={cn(
                'text-foreground placeholder:text-muted-foreground placeholder:text-sm selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none',
                'border-input/50 hover:enabled:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-destructive/50',
                'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                className
            )}
            {...props}
        />
    )
}

function InputWrapper({
    label,
    description,
    error,
    required,
    startAddon,
    endAddon,
    action,
    id,
    className,
    ...props
}: InputWrapperProps) {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hasAddon = startAddon || endAddon
    const isInvalid = !!error

    return (
        <Field data-invalid={isInvalid || undefined} className={cn('relative', isInvalid && 'pb-1')}>
            {label && (
                <FieldLabel htmlFor={inputId} required={required} className='text-foreground'>
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className='text-muted-foreground'>{description}</FieldDescription>
            )}

            {/* plain input or input + action button */}
            {!hasAddon && !action && (
                <Input
                    id={inputId}
                    aria-invalid={isInvalid || undefined}
                    className={className}
                    {...props}
                />
            )}

            {/* input + action button (ButtonGroup style) */}
            {!hasAddon && action && (
                <div className='flex items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-0 [&>*:not(:last-child)]:rounded-e-none *:h-9'>
                    <Input
                        id={inputId}
                        aria-invalid={isInvalid || undefined}
                        className={cn('flex-1', className)}
                        {...props}
                    />
                    {action}
                </div>
            )}

            {/* input group with addons */}
            {hasAddon && (
                <div
                    className={cn(
                        'flex h-9 w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow,border]',
                        isInvalid
                            ? 'border-destructive has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-destructive/50'
                            : 'border-input/50 has-[input:hover]:border-primary has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/50',
                    )}
                >
                    {startAddon && (
                        <div className='flex items-center border-e border-input/50 ps-2.5 pe-2 text-sm text-muted-foreground'>
                            {startAddon}
                        </div>
                    )}
                    <Input
                        id={inputId}
                        className={cn(
                            'h-auto flex-1 rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 aria-invalid:border-0 aria-invalid:ring-0 aria-invalid:focus-visible:ring-0',
                            className
                        )}
                        {...props}
                    />
                    {endAddon && (
                        <div className='flex items-center border-s border-input/50 ps-2 pe-2.5 text-sm text-muted-foreground'>
                            {endAddon}
                        </div>
                    )}
                </div>
            )}

            {error && <FieldError>{error}</FieldError>}
        </Field>
    )
}

export { Input, InputWrapper }
