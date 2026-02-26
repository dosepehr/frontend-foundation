'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/utils/funcs/cn';

function Select({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot='select' {...props} />;
}

function SelectContainer({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
    return (
        <SelectPrimitive.Group
            data-slot='select-container'
            className={cn('scroll-my-1 p-1 space-y-1', className)}
            {...props}
        />
    );
}

function SelectValue({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot='select-value' {...props} />;
}

function SelectTrigger({
    className,
    size = 'default',
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default';
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot='select-trigger'
            data-size={size}
            className={cn(
                'group',
                'flex w-full items-center justify-between gap-1.5 whitespace-nowrap select-none cursor-pointer',
                'data-[size=default]:h-9 data-[size=sm]:h-7',
                'rounded-md border px-2.5 py-1 text-sm',
                'bg-transparent dark:bg-input/30 border-input',
                'data-placeholder:text-muted-foreground',
                'hover:border-ring',
                'outline outline-transparent',
                'data-[state=open]:border-primary data-[state=open]:outline-primary/40',
                'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
                'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                'transition-[color,box-shadow,border-color,outline-color]',
                'shadow-xs',
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                '*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 *:data-[slot=select-value]:line-clamp-1',
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className='text-muted-foreground size-4 shrink-0 pointer-events-none transition-transform duration-200 group-data-[state=open]:rotate-180' />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    position = 'popper',
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot='select-content'
                className={cn(
                    'bg-popover text-popover-foreground',
                    'data-open:animate-in data-closed:animate-out',
                    'data-closed:fade-out-0 data-open:fade-in-0',
                    'data-closed:zoom-out-95 data-open:zoom-in-95',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    'ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1',
                    'relative z-50 max-h-(--radix-select-content-available-height)',
                    'origin-(--radix-select-content-transform-origin)',
                    'overflow-x-hidden overflow-y-auto duration-100',
                    position === 'popper' && 'w-(--radix-select-trigger-width)',
                    className
                )}
                position={position}
                align='center'
                sideOffset={4}
                collisionPadding={0}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        position === 'popper' &&
                            'w-full min-w-(--radix-select-trigger-width)'
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
    return (
        <SelectPrimitive.Label
            data-slot='select-label'
            className={cn(
                'text-muted-foreground px-1.5 py-1 text-xs',
                className
            )}
            {...props}
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot='select-item'
            className={cn(
                'focus:bg-accent focus:text-accent-foreground cursor-pointer!',
                'gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm',
                'relative flex w-full cursor-default items-center outline-hidden select-none',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                'data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground',
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
                className
            )}
            {...props}
        >
            <span className='pointer-events-none absolute right-2 flex size-4 items-center justify-center'>
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className='pointer-events-none' />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot='select-separator'
            className={cn(
                'bg-border -mx-1 my-1 h-px pointer-events-none',
                className
            )}
            {...props}
        />
    );
}

function SelectScrollUpButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot='select-scroll-up-button'
            className={cn(
                "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
            <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot='select-scroll-down-button'
            className={cn(
                "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
            <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
    );
}

export {
    Select,
    SelectContent,
    SelectContainer,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};

