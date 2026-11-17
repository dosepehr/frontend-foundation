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
    /** date-fns format of each end. */
    format?: string;
    /**
     * Passed to the calendar, e.g. a Jalali `dateLib`, `locale`, `dir` and
     * `numerals` from `@daypicker/persian`. The trigger formats dates with
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
