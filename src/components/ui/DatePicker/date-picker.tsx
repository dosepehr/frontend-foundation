'use client'

import * as React from 'react'
import { useId } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/src/utils/funcs/cn'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Calendar } from '../Calendar'
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field'
import type { DatePickerProps } from './date-picker.types'

function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    label,
    description,
    error,
    required,
    disabled,
    disabledDates,
    className,
    triggerClassName,
    format: dateFormat = 'PPP',
    startAddon,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: DatePickerProps) {
    const triggerId = useId()
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isInvalid = !!error

    const open = externalOpen ?? internalOpen
    const setOpen = externalOnOpenChange ?? setInternalOpen

    return (
        <Field
            data-invalid={isInvalid || undefined}
            className={cn('relative', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={triggerId}
                    required={required}
                    className='text-foreground'
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className='text-muted-foreground'>
                    {description}
                </FieldDescription>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={triggerId}
                        type='button'
                        disabled={disabled}
                        aria-invalid={isInvalid || undefined}
                        aria-expanded={open}
                        className={cn(
                            'group/trigger flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none select-none',
                            'border-input/50 hover:enabled:not-aria-invalid:border-primary',
                            'aria-expanded:not-aria-invalid:border-primary aria-expanded:not-aria-invalid:ring-3 aria-expanded:not-aria-invalid:ring-primary/50',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/50',
                            triggerClassName
                        )}
                    >
                        {startAddon ? (
                            <span className='shrink-0 text-muted-foreground'>
                                {startAddon}
                            </span>
                        ) : (
                            <CalendarIcon className='size-4 shrink-0 text-muted-foreground' />
                        )}
                        <span
                            className={cn(
                                'flex-1 truncate text-start',
                                value ? 'text-foreground' : 'text-muted-foreground'
                            )}
                        >
                            {value ? format(value, dateFormat) : placeholder}
                        </span>
                        <ChevronDownIcon
                            className={cn(
                                'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                open && 'rotate-180'
                            )}
                        />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className='w-auto p-0'
                    align='start'
                    sideOffset={5}
                >
                    <Calendar
                        mode='single'
                        selected={value}
                        onSelect={onChange}
                        disabled={disabledDates}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>

            <FieldError>{error}</FieldError>
        </Field>
    )
}

export { DatePicker }
