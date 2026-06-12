'use client'

import { cn } from '@/src/utils/funcs/cn'
import type { ComponentProps } from 'react'
import { Input } from './input'

function InputGroup({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot='input-group'
            className={cn(
                'flex h-9 w-full items-stretch rounded-md border border-input/50 shadow-xs transition-[color,box-shadow,border]',
                'has-[input:hover]:border-primary',
                'has-[input:not([aria-invalid]):focus-visible]:border-primary has-[input:not([aria-invalid]):focus-visible]:ring-3 has-[input:not([aria-invalid]):focus-visible]:ring-primary/50',
                'has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:hover:border-destructive',
                'has-[input[aria-invalid=true]:focus-visible]:ring-3 has-[input[aria-invalid=true]:focus-visible]:border-destructive has-[input[aria-invalid=true]:focus-visible]:ring-destructive/50',
                className
            )}
        >
            {props.children}
        </div>
    )
}

function InputGroupInput({ className, ...props }: ComponentProps<typeof Input>) {
    return (
        <Input
            className={cn(
                'h-auto flex-1 rounded-none border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0',
                className
            )}
            {...props}
        />
    )
}

type InputGroupAddonProps = ComponentProps<'div'> & {
    align?: 'inline-start' | 'inline-end'
}

function InputGroupAddon({ className, align = 'inline-start', ...props }: InputGroupAddonProps) {
    return (
        <div
            data-slot='input-group-addon'
            data-align={align}
            className={cn(
                'flex items-center',
                align === 'inline-start' && 'order-first border-e border-input/50 ps-2.5 pe-2',
                align === 'inline-end' && 'order-last border-s border-input/50 ps-2 pe-2.5',
                className
            )}
            {...props}
        />
    )
}

function InputGroupText({ className, ...props }: ComponentProps<'span'>) {
    return (
        <span
            data-slot='input-group-text'
            className={cn('text-sm text-muted-foreground select-none', className)}
            {...props}
        />
    )
}

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText }
