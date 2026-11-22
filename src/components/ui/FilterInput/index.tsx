/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { getDateFormatter } from '@/utils/funcs/calendarSystem';
import {
    DateFilterInput,
    MultiSelectFilterInput,
    NumberRangeFilterInput,
    SelectFilterInput,
    TextFilterInput,
} from './components';
import type { FilterInputLabels, FilterInputProps } from './FilterInput.types';

const DEFAULT_LABELS: FilterInputLabels = {
    selectPlaceholder: (label) => `Select the ${label.toLowerCase()}`,
    searchPlaceholder: () => 'Search',
    from: 'From',
    to: 'To',
    loading: 'Loading...',
};

/** The input of one filter, picked by its `type`. */
const FilterInput = ({
    filter,
    calendar,
    calendarProps,
    formatDate,
    labels: custom,
}: FilterInputProps) => {
    const labels = { ...DEFAULT_LABELS, ...custom };

    switch (filter.type) {
        case 'select':
            return <SelectFilterInput filter={filter} labels={labels} />;
        case 'multiselect':
            return <MultiSelectFilterInput filter={filter} labels={labels} />;
        case 'text':
            return <TextFilterInput filter={filter} labels={labels} />;
        case 'number-range':
            return <NumberRangeFilterInput filter={filter} labels={labels} />;
        case 'date':
            return (
                <DateFilterInput
                    filter={filter}
                    labels={labels}
                    calendar={calendar}
                    calendarProps={calendarProps}
                    formatDate={
                        formatDate ??
                        ((date) =>
                            (
                                calendarProps?.dateLib?.format ??
                                getDateFormatter(calendar)
                            )(date, 'd LLLL'))
                    }
                />
            );
    }
};

export default FilterInput;
