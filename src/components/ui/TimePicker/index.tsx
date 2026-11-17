/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Button from '@/components/ui/Button';
import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import Popover, {
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/funcs/cn';
import { ChevronDownIcon, ClockIcon } from 'lucide-react';
import { useId } from 'react';
import { TimeColumn } from './components';
import { useTimePicker } from './hooks/useTimePicker/useTimePicker';
import type { TimePickerProps } from './TimePicker.types';
import { formatTimeLabel } from './utils/time/time';

// Same look as the DatePicker and ComboBox triggers.
const TRIGGER_CLASS = cn(
    'group/trigger flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none select-none',
    'border-input/50 hover:enabled:not-aria-invalid:border-primary',
    'focus-visible:not-aria-invalid:border-primary focus-visible:not-aria-invalid:ring-3 focus-visible:not-aria-invalid:ring-primary/50',
    'aria-expanded:not-aria-invalid:border-primary aria-expanded:not-aria-invalid:ring-3 aria-expanded:not-aria-invalid:ring-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/50 aria-invalid:hover:border-destructive',
);

const TimePicker = ({
    value,
    onChange,
    hourCycle = 24,
    showSeconds = false,
    minuteStep,
    secondStep,
    placeholder = 'Pick a time',
    label,
    description,
    error,
    required,
    disabled,
    clearable = true,
    clearLabel = 'Clear',
    className,
    triggerClassName,
    startAddon,
    open: externalOpen,
    onOpenChange,
}: TimePickerProps) => {
    const triggerId = useId();
    const [open, setOpen] = useControllableState({
        value: externalOpen,
        defaultValue: false,
        onChange: onOpenChange,
    });
    const { columns, hasValue } = useTimePicker({
        value,
        onChange,
        hourCycle,
        showSeconds,
        minuteStep,
        secondStep,
    });

    const timeLabel = formatTimeLabel(value, { hourCycle, showSeconds });

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
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- popover triggers expose their state with aria-expanded */}
                    <button
                        type="button"
                        id={triggerId}
                        disabled={disabled}
                        aria-expanded={open}
                        aria-invalid={!!error || undefined}
                        className={cn(TRIGGER_CLASS, triggerClassName)}
                    >
                        <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
                            {startAddon ?? <ClockIcon />}
                        </span>
                        <span
                            className={cn(
                                'flex-1 truncate text-start',
                                timeLabel
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {timeLabel || placeholder}
                        </span>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn(
                                'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                open && 'rotate-180',
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    aria-label={label ?? 'Choose a time'}
                    align="start"
                    sideOffset={5}
                    className="w-auto p-1"
                >
                    <div className="flex divide-x divide-border rtl:divide-x-reverse">
                        {columns.map(({ id, ...column }) => (
                            <TimeColumn key={id} {...column} />
                        ))}
                    </div>
                    {clearable && hasValue && (
                        <div className="border-t border-border p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    onChange?.();
                                    setOpen(false);
                                }}
                            >
                                {clearLabel}
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default TimePicker;
