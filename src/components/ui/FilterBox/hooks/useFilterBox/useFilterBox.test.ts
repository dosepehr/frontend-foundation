import type {
    Filter,
    NumberRangeFilter,
    SelectFilter,
    TextFilter,
} from '@/utils/funcs/filters';
import { act, renderHook } from '@testing-library/react';
import { useFilterBox, type UseFilterBoxOptions } from './useFilterBox';

const OPTIONS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
];

const SUMMARY = {
    formatDate: (date: Date) => date.toISOString().slice(0, 10),
    formatNumber: String,
    manySelected: (count: number) => `${count} selected`,
};

function makeFilters(
    values: { name?: string | null; status?: string | null } = {},
) {
    return {
        status: {
            type: 'select',
            label: 'Status',
            options: OPTIONS,
            value: values.status ?? null,
            onChange: vi.fn(),
        } satisfies SelectFilter,
        owner: {
            type: 'select',
            label: 'Owner',
            options: OPTIONS,
            value: null,
            onChange: vi.fn(),
            onSearchChange: vi.fn(),
        } satisfies SelectFilter,
        name: {
            type: 'text',
            label: 'Name',
            value: values.name ?? null,
            onChange: vi.fn(),
        } satisfies TextFilter,
        price: {
            type: 'number-range',
            label: 'Price',
            value: null,
            onChange: vi.fn(),
        } satisfies NumberRangeFilter,
    };
}

function setup(
    filters = makeFilters(),
    extra: Partial<UseFilterBoxOptions> = {},
) {
    const hook = renderHook(() =>
        useFilterBox({
            filters,
            debounceMs: 300,
            summaryOptions: SUMMARY,
            ...extra,
        }),
    );
    return { ...hook, filters };
}

/** The open filter, narrowed to the type the test expects. */
function active<Type extends Filter['type']>(
    current: { activeFilter?: Filter },
    type: Type,
): Extract<Filter, { type: Type }> {
    const filter = current.activeFilter;
    if (filter?.type !== type)
        throw new Error(`Expected an open ${type} filter`);
    return filter as Extract<Filter, { type: Type }>;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useFilterBox — views and rows', () => {
    it('opens a filter and goes back to the list', () => {
        const { result } = setup();
        act(() => result.current.openFilter('status'));
        expect(result.current.activeFilter?.label).toBe('Status');

        act(() => result.current.back());
        expect(result.current.activeFilter).toBeUndefined();
    });

    it('returns to the list when closed', () => {
        const { result } = setup();
        act(() => result.current.setOpen(true));
        act(() => result.current.openFilter('name'));
        act(() => result.current.setOpen(false));
        expect(result.current.open).toBe(false);
        expect(result.current.activeFilter).toBeUndefined();
    });

    it('builds a row per filter with a summary', () => {
        const { result } = setup(makeFilters({ status: 'b' }));
        expect(result.current.rows.map((row) => [row.id, row.summary])).toEqual(
            [
                ['status', 'Beta'],
                ['owner', null],
                ['name', null],
                ['price', null],
            ],
        );
        expect(result.current.hasActive).toBe(true);
    });

    it('passes filters without drafts or server search through untouched', () => {
        const { result, filters } = setup();
        act(() => result.current.openFilter('status'));
        expect(result.current.activeFilter).toBe(filters.status);
    });

    it('ignores ids that are not filters', () => {
        const { result } = setup();
        act(() => result.current.openFilter('missing'));
        expect(result.current.activeFilter).toBeUndefined();
    });
});

describe('useFilterBox — drafts', () => {
    it('applies trimmed text after typing stops, showing the draft meanwhile', () => {
        const { result, filters } = setup(makeFilters({ name: 'old' }));
        act(() => result.current.openFilter('name'));
        expect(active(result.current, 'text').value).toBe('old');

        act(() => active(result.current, 'text').onChange(' ada '));
        expect(active(result.current, 'text').value).toBe(' ada ');
        expect(filters.name.onChange).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(300));
        expect(filters.name.onChange).toHaveBeenCalledWith('ada');
        // The draft stays while editing, so a trailing space isn't eaten.
        expect(active(result.current, 'text').value).toBe(' ada ');
    });

    it('sends empty text as null', () => {
        const { result, filters } = setup();
        act(() => result.current.openFilter('name'));
        act(() => active(result.current, 'text').onChange('  '));
        act(() => vi.advanceTimersByTime(300));
        expect(filters.name.onChange).toHaveBeenCalledWith(null);
    });

    it('applies number ranges after editing stops, an empty one as null', () => {
        const { result, filters } = setup();
        act(() => result.current.openFilter('price'));
        act(() =>
            active(result.current, 'number-range').onChange({
                from: 10,
                to: 20,
            }),
        );
        act(() => vi.advanceTimersByTime(300));
        expect(filters.price.onChange).toHaveBeenLastCalledWith({
            from: 10,
            to: 20,
        });

        act(() => active(result.current, 'number-range').onChange({}));
        act(() => vi.advanceTimersByTime(300));
        expect(filters.price.onChange).toHaveBeenLastCalledWith(null);
    });

    it('applies pending changes at once when leaving the filter', () => {
        const { result, filters } = setup();
        act(() => result.current.openFilter('name'));
        act(() => active(result.current, 'text').onChange('now'));
        act(() => result.current.back());
        expect(filters.name.onChange).toHaveBeenCalledWith('now');
    });

    it('debounces server searches', () => {
        const { result, filters } = setup();
        act(() => result.current.openFilter('owner'));
        act(() => active(result.current, 'select').onSearchChange?.('a'));
        act(() => active(result.current, 'select').onSearchChange?.('ad'));
        expect(filters.owner.onSearchChange).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(300));
        expect(filters.owner.onSearchChange).toHaveBeenCalledTimes(1);
        expect(filters.owner.onSearchChange).toHaveBeenCalledWith('ad');
    });
});

describe('useFilterBox — reset', () => {
    it('calls onReset and returns to the list', () => {
        const onReset = vi.fn();
        const { result } = setup(makeFilters(), { onReset });
        act(() => result.current.openFilter('status'));
        act(() => result.current.reset());
        expect(onReset).toHaveBeenCalled();
        expect(result.current.activeFilter).toBeUndefined();
    });

    it('clears every filter without onReset', () => {
        const { result, filters } = setup();
        act(() => result.current.reset());
        expect(filters.status.onChange).toHaveBeenCalledWith(null);
        expect(filters.price.onChange).toHaveBeenCalledWith(null);
    });

    it('drops pending changes so they cannot undo the reset', () => {
        const { result, filters } = setup(makeFilters(), { onReset: vi.fn() });
        act(() => result.current.openFilter('name'));
        act(() => active(result.current, 'text').onChange('typed'));
        act(() => result.current.reset());
        act(() => vi.advanceTimersByTime(300));
        expect(filters.name.onChange).not.toHaveBeenCalled();
    });

    it('clears server searches that were used', () => {
        const { result, filters } = setup(makeFilters(), { onReset: vi.fn() });
        act(() => result.current.openFilter('owner'));
        act(() => active(result.current, 'select').onSearchChange?.('ad'));
        act(() => vi.advanceTimersByTime(300));
        act(() => result.current.reset());
        expect(filters.owner.onSearchChange).toHaveBeenLastCalledWith('');
    });
});
