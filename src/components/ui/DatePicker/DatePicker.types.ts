import type { CalendarSystem } from '@/utils/funcs/calendarSystem';
import type { ReactNode } from 'react';
import type { Matcher } from 'react-day-picker';

export type DatePickerProps = {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    disabledDates?: Matcher | Matcher[];
    className?: string;
    triggerClassName?: string;
    /** date-fns format; defaults to "PPP" ("d LLLL y" in Jalali). */
    format?: string;
    /**
     * Calendar shown in the popover and the trigger. `value` stays a plain
     * `Date`, so forms send the Gregorian day either way.
     */
    calendar?: CalendarSystem;
    startAddon?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
