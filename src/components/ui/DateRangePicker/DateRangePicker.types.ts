import type { CalendarSystem } from '@/utils/funcs/calendarSystem';
import type { ReactNode } from 'react';
import type { DateRange, DayPickerProps, Matcher } from 'react-day-picker';

export type DateRangePickerProps = {
    value?: DateRange;
    /** Called with no range when cleared. */
    onChange?: (range?: DateRange) => void;
    placeholder?: string;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    disabledDates?: Matcher | Matcher[];
    /** Months shown side by side. */
    numberOfMonths?: number;
    /** Minimum and maximum number of nights in the range. */
    minDays?: number;
    maxDays?: number;
    /** date-fns format of each end; "d LLLL y" by default in Jalali. */
    format?: string;
    /**
     * Calendar shown in the popover and the trigger. `value` stays plain
     * `Date`s, so forms send the Gregorian range either way.
     */
    calendar?: CalendarSystem;
    /**
     * Fine-tunes the calendar, e.g. `weekStartsOn` or `numerals`; these win
     * over the `calendar` defaults. The trigger formats dates with
     * `calendarProps.dateLib.format` when there is one.
     */
    calendarProps?: Pick<
        DayPickerProps,
        'dateLib' | 'locale' | 'dir' | 'numerals' | 'weekStartsOn'
    >;
    /** Closes the popover once both ends are picked. */
    closeOnSelect?: boolean;
    className?: string;
    triggerClassName?: string;
    startAddon?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
