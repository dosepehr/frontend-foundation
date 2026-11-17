// Types and pure helpers for FilterBox. Each filter is one object holding its
// type, label, current value and change handler, so a filter's value type
// always matches its input. `null` means "cleared" for every type.
import type { DateRange } from 'react-day-picker';

export type FilterOption = { value: string; label: string };
export type NumberRange = { from?: number; to?: number };

type FilterOf<Type extends string, Value> = {
    type: Type;
    label: string;
    /** Current value; `null` when the filter is cleared. */
    value: Value | null;
    onChange: (value: Value | null) => void;
};

/** Options that load from a server: loading states, paging and search. */
export type RemoteOptions = {
    isPending?: boolean;
    isError?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onFetchNextPage?: () => void;
    /** Server-side search (FilterBox debounces it); turns off local filtering. */
    onSearchChange?: (search: string) => void;
};

export type SelectFilter = FilterOf<'select', string> &
    RemoteOptions & {
        options: FilterOption[];
        /** Adds a search box; implied by `onSearchChange` and `onFetchNextPage`. */
        searchable?: boolean;
    };

export type MultiSelectFilter = FilterOf<'multiselect', string[]> &
    RemoteOptions & { options: FilterOption[] };

/** Free text, applied trimmed after typing stops. */
export type TextFilter = FilterOf<'text', string> & { placeholder?: string };

export type DateFilter = FilterOf<'date', DateRange> & {
    /** 'single' picks one day; the value is still a range on that day. */
    mode?: 'range' | 'single';
};

export type NumberRangeFilter = FilterOf<'number-range', NumberRange> & {
    min?: number;
    max?: number;
    step?: number;
};

export type Filter =
    | SelectFilter
    | MultiSelectFilter
    | TextFilter
    | DateFilter
    | NumberRangeFilter;

export type FilterType = Filter['type'];

/** Filters by id; the id is only used as a React key. */
export type Filters = Record<string, Filter>;

/** Whether a filter currently narrows anything. */
export function isFilterActive(filter: Filter) {
    const { value } = filter;
    if (value === null) return false;
    if (typeof value === 'string') return value !== '';
    if (Array.isArray(value)) return value.length > 0;
    return value.from !== undefined || value.to !== undefined;
}

export const hasActiveFilters = (filters: Filters) =>
    Object.values(filters).some(isFilterActive);

/** Clears every filter. */
export function clearFilters(filters: Filters) {
    for (const filter of Object.values(filters)) filter.onChange(null);
}

/** Selected options of a multi-select (0 for other types). */
export const selectedCount = (filter: Filter) =>
    filter.type === 'multiselect' ? (filter.value?.length ?? 0) : 0;

/** Whether a select shows a search box (a combo box, not a plain select). */
export const isSearchableSelect = (filter: SelectFilter) =>
    !!(filter.searchable || filter.onSearchChange || filter.onFetchNextPage);

/** The remote-option props of a filter, for a combo box. */
export function remoteOptionProps(filter: SelectFilter | MultiSelectFilter) {
    return {
        options: filter.options,
        isPending: filter.isPending,
        isError: filter.isError,
        hasNextPage: filter.hasNextPage,
        isFetchingNextPage: filter.isFetchingNextPage,
        onFetchNextPage: filter.onFetchNextPage,
        onSearchChange: filter.onSearchChange,
    };
}

export type SummaryOptions = {
    formatDate: (date: Date) => string;
    formatNumber: (value: number) => string;
    /** Text once `manyThreshold` or more options are selected. */
    manySelected: (count: number) => string;
    manyThreshold?: number;
    listSeparator?: string;
};

const labelOf = (options: FilterOption[], value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

/** Short text describing a filter's value, or null when it is inactive. */
export function summarizeFilter(
    filter: Filter,
    {
        formatDate,
        formatNumber,
        manySelected,
        manyThreshold = 3,
        listSeparator = ', ',
    }: SummaryOptions,
): string | null {
    if (!isFilterActive(filter)) return null;

    switch (filter.type) {
        case 'text':
            return filter.value;
        case 'select':
            return filter.value === null
                ? null
                : labelOf(filter.options, filter.value);
        case 'multiselect': {
            const values = filter.value ?? [];
            if (values.length >= manyThreshold)
                return manySelected(values.length);
            return values
                .map((value) => labelOf(filter.options, value))
                .join(listSeparator);
        }
        case 'date': {
            const { from, to } = filter.value ?? {};
            if (!from) return null;
            if (filter.mode === 'single' || !to) return formatDate(from);
            return `${formatDate(from)} - ${formatDate(to)}`;
        }
        case 'number-range': {
            const { from, to } = filter.value ?? {};
            const show = (n?: number) =>
                n === undefined ? '-' : formatNumber(n);
            return `${show(from)} - ${show(to)}`;
        }
    }
}
