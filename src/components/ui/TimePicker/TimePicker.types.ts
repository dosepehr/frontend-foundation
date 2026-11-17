import type { ReactNode } from 'react';
import type { TimeColumn } from './hooks/useTimePicker/useTimePicker';
import type { HourCycle } from './utils/time/time';

export type TimePickerProps = {
    /** "HH:mm", or "HH:mm:ss" with `showSeconds` (24-hour, zero-padded). */
    value?: string;
    /** Called with no value when cleared. */
    onChange?: (value?: string) => void;
    /** Display clock; the value is always 24-hour. */
    hourCycle?: HourCycle;
    showSeconds?: boolean;
    minuteStep?: number;
    secondStep?: number;
    placeholder?: string;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    /** Shows a "Clear" button in the popover. */
    clearable?: boolean;
    clearLabel?: string;
    className?: string;
    triggerClassName?: string;
    startAddon?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export type TimeColumnProps = Omit<TimeColumn, 'id'>;
