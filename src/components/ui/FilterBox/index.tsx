/* c8 ignore start */
'use client';
/* c8 ignore stop */

import FilterInput from '@/components/ui/FilterInput';
import Popover, { PopoverContent } from '@/components/ui/Popover';
import { getDateFormatter } from '@/utils/funcs/calendarSystem';
import { formatNumber } from '@/utils/funcs/numberFormat';
import { FilterList, FilterPanel, FilterTrigger } from './components';
import type {
    FilterBoxLabels,
    FilterBoxLocale,
    FilterBoxProps,
} from './FilterBox.types';
import { useFilterBox } from './hooks/useFilterBox/useFilterBox';

const LABELS: Record<FilterBoxLocale, FilterBoxLabels> = {
    en: {
        trigger: 'Filter',
        title: 'Filters',
        clearAll: 'Clear filters',
        back: 'Back',
        reset: 'Clear all filters',
        manySelected: (count) => `${count} selected`,
        listSeparator: ', ',
        selectPlaceholder: (label) => `Select the ${label.toLowerCase()}`,
        searchPlaceholder: () => 'Search',
        from: 'From',
        to: 'To',
        loading: 'Loading...',
    },
    fa: {
        trigger: 'فیلتر',
        title: 'فیلترها',
        clearAll: 'حذف فیلترها',
        back: 'بازگشت',
        reset: 'حذف همه فیلترها',
        manySelected: () => 'بیشتر از ۲ مورد',
        listSeparator: '، ',
        selectPlaceholder: (label) => `${label} را انتخاب کنید`,
        searchPlaceholder: () => 'جستجو',
        from: 'از',
        to: 'تا',
        loading: 'در حال بارگذاری...',
    },
};

/**
 * A "Filter" button whose popover lists every filter; opening one shows its
 * input. Each filter carries its own value and `onChange`.
 */
const FilterBox = ({
    filters,
    onReset,
    calendar,
    calendarProps,
    dateFormat = 'yyyy/MM/dd',
    dateInputFormat = 'd LLLL',
    debounceMs,
    locale = 'en',
    labels: custom,
    align = 'start',
    disabled,
    className,
}: FilterBoxProps) => {
    const labels = { ...LABELS[locale], ...custom };
    const format = calendarProps?.dateLib?.format ?? getDateFormatter(calendar);
    const box = useFilterBox({
        filters,
        onReset,
        debounceMs,
        summaryOptions: {
            formatDate: (date) => format(date, dateFormat),
            formatNumber: (value) =>
                formatNumber(value, { thousandSeparator: ',' }),
            manySelected: labels.manySelected,
            listSeparator: labels.listSeparator,
        },
    });

    return (
        <Popover open={box.open} onOpenChange={box.setOpen}>
            <FilterTrigger
                hasActive={box.hasActive}
                disabled={disabled}
                onReset={box.reset}
                labels={labels}
                className={className}
            />
            <PopoverContent
                aria-label={labels.title}
                align={align}
                sideOffset={5}
                className="w-80 p-1"
            >
                {box.activeFilter ? (
                    <FilterPanel
                        filter={box.activeFilter}
                        onBack={box.back}
                        labels={labels}
                    >
                        <FilterInput
                            filter={box.activeFilter}
                            calendar={calendar}
                            calendarProps={calendarProps}
                            formatDate={(date) => format(date, dateInputFormat)}
                            labels={labels}
                        />
                    </FilterPanel>
                ) : (
                    <FilterList
                        rows={box.rows}
                        onOpenFilter={box.openFilter}
                        onReset={box.reset}
                        labels={labels}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

export default FilterBox;
