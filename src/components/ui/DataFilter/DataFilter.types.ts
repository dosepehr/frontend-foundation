import type {
    FilterBoxLocale,
    FilterBoxProps,
} from '@/components/ui/FilterBox/FilterBox.types';
import type { SelectOption } from '@/components/ui/Select/Select.types';
import type { Filters } from '@/utils/funcs/filters';

export type DataFilterSearch = {
    /** Applied search term; null for none (e.g. no URL param). */
    value: string | null;
    /** Called after typing stops, and with '' when cleared. */
    onChange: (search: string) => void;
    /** Defaults to the locale's "Search". */
    placeholder?: string;
    /** Shows the box but disables it, for endpoints with no search. */
    disabled?: boolean;
    debounceMs?: number;
};

export type DataFilterSort = {
    /** Current ordering, e.g. '-created_at' (`-` for descending). */
    value: string | null;
    onChange: (ordering: string) => void;
    /** Empty hides the sort select. */
    options: SelectOption[];
};

export type DataFilterLabels = {
    /** Search box placeholder. */
    search: string;
    /** Accessible name of the search box's clear button. */
    clearSearch: string;
    /** Sort select placeholder while nothing is selected. */
    sort: string;
    /** Shown before the selected sort option. */
    sortPrefix: string;
};

export type DataFilterProps = {
    /** The search box; hidden without it. */
    search?: DataFilterSearch;
    /** The filters of the FilterBox; hidden without any. */
    filters?: Filters;
    /** Other FilterBox props, e.g. a Jalali `calendarProps` or `onReset`. */
    filterBox?: Omit<FilterBoxProps, 'filters' | 'locale'>;
    /** The sort select; hidden without it or with no options. */
    sort?: DataFilterSort;
    /** Built-in texts of every control; `labels` overrides single texts. */
    locale?: FilterBoxLocale;
    labels?: Partial<DataFilterLabels>;
    /** `data-tour` anchors for a guided tour. */
    tourIds?: { search?: string; filters?: string };
    className?: string;
};

export type SortSelectProps = DataFilterSort & { labels: DataFilterLabels };
