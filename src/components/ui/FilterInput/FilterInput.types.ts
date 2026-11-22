import type { CalendarSystem } from '@/utils/funcs/calendarSystem';
import type {
    DateFilter,
    Filter,
    MultiSelectFilter,
    NumberRangeFilter,
    SelectFilter,
    TextFilter,
} from '@/utils/funcs/filters';
import type { DayPickerProps } from 'react-day-picker';

/**
 * Fine-tunes the calendar of date filters, e.g. `weekStartsOn`; these win
 * over the `calendar` defaults.
 */
export type FilterCalendarProps = Pick<
    DayPickerProps,
    'dateLib' | 'locale' | 'dir' | 'numerals' | 'weekStartsOn'
>;

export type FilterInputLabels = {
    /** Placeholder of selects, from the filter label. */
    selectPlaceholder: (label: string) => string;
    /** Placeholder of text inputs and search boxes, from the filter label. */
    searchPlaceholder: (label: string) => string;
    from: string;
    to: string;
    /** Shown while the next page of options loads. */
    loading: string;
};

export type FilterInputProps = {
    filter: Filter;
    /** Calendar of date filters; values stay plain (Gregorian) dates. */
    calendar?: CalendarSystem;
    calendarProps?: FilterCalendarProps;
    /** Formats the dates of date filters; defaults to "d LLLL". */
    formatDate?: (date: Date) => string;
    labels?: Partial<FilterInputLabels>;
};

type InputProps<Kind extends Filter> = {
    filter: Kind;
    labels: FilterInputLabels;
};

export type SelectInputProps = InputProps<SelectFilter>;
export type MultiSelectInputProps = InputProps<MultiSelectFilter>;
export type TextInputProps = InputProps<TextFilter>;
export type NumberRangeInputProps = InputProps<NumberRangeFilter>;
export type DateInputProps = InputProps<DateFilter> & {
    calendar?: CalendarSystem;
    calendarProps?: FilterCalendarProps;
    formatDate: (date: Date) => string;
};
