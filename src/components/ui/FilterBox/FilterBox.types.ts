import type {
    FilterCalendarProps,
    FilterInputLabels,
} from '@/components/ui/FilterInput/FilterInput.types';
import type { Filter, Filters } from '@/utils/funcs/filters';
import type { ReactNode } from 'react';

/** Language of the built-in texts. */
export type FilterBoxLocale = 'en' | 'fa';

export type FilterBoxLabels = FilterInputLabels & {
    trigger: string;
    title: string;
    clearAll: string;
    back: string;
    /** Accessible name of the X button that clears every filter. */
    reset: string;
    /** Row summary once three or more options are selected. */
    manySelected: (count: number) => string;
    listSeparator: string;
};

export type FilterBoxProps = {
    /** The filters, each with its value and `onChange`; keys are React keys. */
    filters: Filters;
    /** Clears the filters; defaults to calling every `onChange` with null. */
    onReset?: () => void;
    /** Calendar of date filters, e.g. Jalali; also formats their dates. */
    calendarProps?: FilterCalendarProps;
    /** date-fns format of dates in the list's summaries. */
    dateFormat?: string;
    /** date-fns format of dates in a date filter's panel. */
    dateInputFormat?: string;
    /** Delay before text, number-range and server-search changes apply. */
    debounceMs?: number;
    /** Built-in texts to use; `labels` overrides single texts. */
    locale?: FilterBoxLocale;
    labels?: Partial<FilterBoxLabels>;
    align?: 'start' | 'center' | 'end';
    disabled?: boolean;
    className?: string;
};

export type FilterTriggerProps = {
    hasActive: boolean;
    disabled?: boolean;
    onReset: () => void;
    labels: FilterBoxLabels;
    className?: string;
};

export type FilterRowData = {
    id: string;
    filter: Filter;
    summary: string | null;
    count: number;
};

export type FilterListProps = {
    rows: FilterRowData[];
    onOpenFilter: (id: string) => void;
    onReset: () => void;
    labels: FilterBoxLabels;
};

export type FilterRowProps = Omit<FilterRowData, 'id'> & { onOpen: () => void };

export type FilterPanelProps = {
    filter: Filter;
    onBack: () => void;
    labels: FilterBoxLabels;
    children: ReactNode;
};
