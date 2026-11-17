import { describe, expect, it, vi } from 'vitest';
import {
    clearFilters,
    hasActiveFilters,
    isFilterActive,
    isSearchableSelect,
    remoteOptionProps,
    selectedCount,
    summarizeFilter,
    type DateFilter,
    type MultiSelectFilter,
    type NumberRangeFilter,
    type SelectFilter,
    type SummaryOptions,
    type TextFilter,
} from '.';

const OPTIONS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma' },
];

const select = (value: string | null = null): SelectFilter => ({
    type: 'select',
    label: 'Status',
    options: OPTIONS,
    value,
    onChange: vi.fn(),
});
const multi = (value: string[] | null = null): MultiSelectFilter => ({
    type: 'multiselect',
    label: 'Tags',
    options: OPTIONS,
    value,
    onChange: vi.fn(),
});
const text = (value: string | null = null): TextFilter => ({
    type: 'text',
    label: 'Name',
    value,
    onChange: vi.fn(),
});
const date = (
    value: DateFilter['value'] = null,
    mode?: 'single',
): DateFilter => ({
    type: 'date',
    label: 'Created',
    value,
    mode,
    onChange: vi.fn(),
});
const range = (
    value: NumberRangeFilter['value'] = null,
): NumberRangeFilter => ({
    type: 'number-range',
    label: 'Price',
    value,
    onChange: vi.fn(),
});

const SUMMARY: SummaryOptions = {
    formatDate: (day) => `${day.getMonth() + 1}/${day.getDate()}`,
    formatNumber: (value) => value.toLocaleString('en-US'),
    manySelected: (count) => `${count} selected`,
};

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

describe('isFilterActive and hasActiveFilters', () => {
    it('treats null and empty values as inactive', () => {
        for (const filter of [
            select(),
            text(''),
            multi([]),
            range({}),
            date({ from: undefined }),
        ]) {
            expect(isFilterActive(filter)).toBe(false);
        }
    });

    it('treats values as active', () => {
        for (const filter of [
            select('a'),
            text('x'),
            multi(['a']),
            range({ to: 0 }),
            date({ from: JAN_5 }),
        ]) {
            expect(isFilterActive(filter)).toBe(true);
        }
    });

    it('knows whether any filter is active', () => {
        expect(hasActiveFilters({ a: select(), b: text() })).toBe(false);
        expect(hasActiveFilters({ a: select(), b: text('x') })).toBe(true);
    });
});

describe('clearFilters and selectedCount', () => {
    it('clears every filter with null', () => {
        const filters = { a: select('a'), b: range({ from: 1 }) };
        clearFilters(filters);
        expect(filters.a.onChange).toHaveBeenCalledWith(null);
        expect(filters.b.onChange).toHaveBeenCalledWith(null);
    });

    it('counts the options of multi-selects only', () => {
        expect(selectedCount(multi(['a', 'b']))).toBe(2);
        expect(selectedCount(multi())).toBe(0);
        expect(selectedCount(select('a'))).toBe(0);
    });
});

describe('select helpers', () => {
    it('makes a select searchable when asked or when its options are remote', () => {
        expect(isSearchableSelect(select())).toBe(false);
        expect(isSearchableSelect({ ...select(), searchable: true })).toBe(
            true,
        );
        expect(
            isSearchableSelect({ ...select(), onSearchChange: vi.fn() }),
        ).toBe(true);
        expect(
            isSearchableSelect({ ...select(), onFetchNextPage: vi.fn() }),
        ).toBe(true);
    });

    it('picks the remote-option props', () => {
        const onFetchNextPage = vi.fn();
        expect(
            remoteOptionProps({
                ...multi(),
                isPending: true,
                hasNextPage: true,
                onFetchNextPage,
            }),
        ).toEqual({
            options: OPTIONS,
            isPending: true,
            isError: undefined,
            hasNextPage: true,
            isFetchingNextPage: undefined,
            onFetchNextPage,
            onSearchChange: undefined,
        });
    });
});

describe('summarizeFilter', () => {
    it('returns null for inactive filters', () => {
        expect(summarizeFilter(select(), SUMMARY)).toBeNull();
        expect(summarizeFilter(range({}), SUMMARY)).toBeNull();
    });

    it('shows the label of the selected option, or the raw value', () => {
        expect(summarizeFilter(select('b'), SUMMARY)).toBe('Beta');
        expect(summarizeFilter(select('zzz'), SUMMARY)).toBe('zzz');
    });

    it('lists up to two labels, then a count', () => {
        expect(summarizeFilter(multi(['a', 'b']), SUMMARY)).toBe('Alpha, Beta');
        expect(summarizeFilter(multi(['a', 'b', 'c']), SUMMARY)).toBe(
            '3 selected',
        );
        expect(
            summarizeFilter(multi(['a', 'b']), {
                ...SUMMARY,
                listSeparator: '، ',
            }),
        ).toBe('Alpha، Beta');
    });

    it('shows text as typed', () => {
        expect(summarizeFilter(text('ada'), SUMMARY)).toBe('ada');
    });

    it('formats dates', () => {
        expect(summarizeFilter(date({ from: JAN_5, to: JAN_9 }), SUMMARY)).toBe(
            '1/5 - 1/9',
        );
        expect(summarizeFilter(date({ from: JAN_5 }), SUMMARY)).toBe('1/5');
        expect(
            summarizeFilter(
                date({ from: JAN_5, to: JAN_5 }, 'single'),
                SUMMARY,
            ),
        ).toBe('1/5');
        expect(
            summarizeFilter(date({ from: undefined, to: JAN_9 }), SUMMARY),
        ).toBeNull();
    });

    it('formats number ranges with open ends', () => {
        expect(summarizeFilter(range({ from: 1000, to: 5000 }), SUMMARY)).toBe(
            '1,000 - 5,000',
        );
        expect(summarizeFilter(range({ from: 10 }), SUMMARY)).toBe('10 - -');
    });
});
