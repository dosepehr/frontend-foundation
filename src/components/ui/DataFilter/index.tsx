/* c8 ignore start */
'use client';
/* c8 ignore stop */

import FilterBox from '@/components/ui/FilterBox';
import type { FilterBoxLocale } from '@/components/ui/FilterBox/FilterBox.types';
import SearchInput from '@/components/ui/SearchInput';
import { cn } from '@/utils/funcs/cn';
import { SortSelect } from './components';
import type { DataFilterLabels, DataFilterProps } from './DataFilter.types';
import { useDataFilter } from './hooks/useDataFilter/useDataFilter';

const LABELS: Record<FilterBoxLocale, DataFilterLabels> = {
    en: {
        search: 'Search',
        clearSearch: 'Clear search',
        sort: 'Sort',
        sortPrefix: 'Sort:',
    },
    fa: {
        search: 'جستجو',
        clearSearch: 'پاک کردن جستجو',
        sort: 'مرتب سازی',
        sortPrefix: 'مرتب سازی:',
    },
};

/**
 * Toolbar above a list: search box, FilterBox and sort select. Each control
 * shows when its prop is given; DataFilter holds no state of its own.
 */
const DataFilter = ({
    search,
    filters = {},
    filterBox,
    sort,
    locale = 'en',
    labels: custom,
    tourIds,
    className,
}: DataFilterProps) => {
    const labels = { ...LABELS[locale], ...custom };
    const placeholder = search?.placeholder ?? labels.search;
    const toolbar = useDataFilter({
        search: search?.value ?? '',
        onSearchChange: search?.onChange,
    });
    const hasFilters = Object.keys(filters).length > 0;
    // An empty sort list would be a dead control.
    const hasSort = !!sort && sort.options.length > 0;

    return (
        <div
            data-slot="data-filter"
            className={cn(
                'flex w-full flex-col gap-3 md:flex-row md:items-start',
                className,
            )}
        >
            {search && (
                <div className="min-w-0 flex-1" data-tour={tourIds?.search}>
                    <SearchInput
                        aria-label={placeholder}
                        placeholder={placeholder}
                        searchLabel={labels.search}
                        clearLabel={labels.clearSearch}
                        value={toolbar.searchText}
                        onValueChange={toolbar.setSearchText}
                        onSearch={toolbar.commitSearch}
                        debounceMs={search.debounceMs ?? 400}
                        disabled={search.disabled}
                    />
                </div>
            )}
            {(hasFilters || hasSort) && (
                <div className="flex shrink-0 items-start gap-3">
                    {hasFilters && (
                        <div data-tour={tourIds?.filters}>
                            <FilterBox
                                {...filterBox}
                                filters={filters}
                                locale={locale}
                            />
                        </div>
                    )}
                    {hasSort && <SortSelect {...sort} labels={labels} />}
                </div>
            )}
        </div>
    );
};

export default DataFilter;
