/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Calendar from '@/components/ui/Calendar';
import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import Popover, {
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { useDateRangePicker } from '@/hooks/useDateRangePicker';
import { cn } from '@/utils/funcs/cn';
import { CalendarRangeIcon, ChevronDownIcon } from 'lucide-react';
import { useId } from 'react';
import type { DateRangePickerProps } from './DateRangePicker.types';

// Same look as the DatePicker and ComboBox triggers.
const TRIGGER_CLASS = cn(
    'group/trigger flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none select-none',
    'border-input/50 hover:enabled:not-aria-invalid:border-primary',
    'focus-visible:not-aria-invalid:border-primary focus-visible:not-aria-invalid:ring-3 focus-visible:not-aria-invalid:ring-primary/50',
    'aria-expanded:not-aria-invalid:border-primary aria-expanded:not-aria-invalid:ring-3 aria-expanded:not-aria-invalid:ring-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/50 aria-invalid:hover:border-destructive',
);

const DateRangePicker = ({
    value,
    onChange,
    placeholder = 'Pick a date range',
    label,
    description,
    error,
    required,
    disabled,
    disabledDates,
    numberOfMonths = 2,
    minDays,
    maxDays,
    format,
    calendarProps,
    closeOnSelect,
    className,
    triggerClassName,
    startAddon,
    open: externalOpen,
    onOpenChange,
}: DateRangePickerProps) => {
    const triggerId = useId();
    const picker = useDateRangePicker({
        value,
        onChange,
        format,
        formatDate: calendarProps?.dateLib?.format,
        closeOnSelect,
        open: externalOpen,
        onOpenChange,
    });

    return (
        <Field
            data-invalid={!!error || undefined}
            className={cn('relative pb-1', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={triggerId}
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
            <Popover open={picker.open} onOpenChange={picker.setOpen}>
                <PopoverTrigger asChild>
                    {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- popover triggers expose their state with aria-expanded */}
                    <button
                        type="button"
                        id={triggerId}
                        disabled={disabled}
                        aria-expanded={picker.open}
                        aria-invalid={!!error || undefined}
                        className={cn(TRIGGER_CLASS, triggerClassName)}
                    >
                        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
                            {startAddon ?? <CalendarRangeIcon />}
                        </span>
                        <span
                            className={cn(
                                'flex-1 truncate text-start',
                                picker.label
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {picker.label || placeholder}
                        </span>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn(
                                'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                picker.open && 'rotate-180',
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    aria-label={label ?? 'Choose a date range'}
                    className="w-auto p-0"
                    align="start"
                    sideOffset={5}
                >
                    <Calendar
                        {...calendarProps}
                        mode="range"
                        selected={value}
                        onSelect={picker.select}
                        defaultMonth={value?.from}
                        numberOfMonths={numberOfMonths}
                        min={minDays}
                        max={maxDays}
                        disabled={disabledDates}
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- moving focus into a popover on user-triggered open is the correct pattern; this rule targets page-load autofocus
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default DateRangePicker;
