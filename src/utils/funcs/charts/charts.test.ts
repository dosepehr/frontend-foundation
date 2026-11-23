import {
    cartesianTable,
    chartQueryState,
    createCompactFormatter,
    createNumberFormatter,
    createPercentFormatter,
    foldSmallSlices,
    isChartDataEmpty,
    lastValueIndex,
    pointClickHandler,
    resolveSeries,
    withSlotColors,
} from '.';

describe('number formatters', () => {
    it('groups thousands in the locale digits', () => {
        expect(createNumberFormatter()(1284.567)).toBe('1,284.57');
        expect(createNumberFormatter('fa')(1284)).toBe('۱٬۲۸۴');
    });

    it('compacts and formats percents', () => {
        expect(createCompactFormatter()(12_900)).toBe('12.9K');
        expect(createPercentFormatter()(0.25)).toBe('25%');
    });
});

describe('withSlotColors', () => {
    it('colors entries by their config position', () => {
        const config = withSlotColors({
            a: { label: 'A' },
            b: { label: 'B', color: 'red' },
            c: { label: 'C' },
        });
        expect(config.a.color).toBe('var(--chart-1)');
        expect(config.b.color).toBe('red');
        expect(config.c.color).toBe('var(--chart-3)');
    });

    it('keeps theme colors', () => {
        const theme = { light: '#000', dark: '#fff' };
        expect(withSlotColors({ a: { theme } }).a).toEqual({ theme });
    });
});

describe('resolveSeries', () => {
    const config = { a: {}, b: {}, c: {} };

    it('defaults to every config key', () => {
        expect(resolveSeries(config)).toEqual(['a', 'b', 'c']);
    });

    it('keeps the given order and drops unknown keys', () => {
        expect(resolveSeries(config, ['c', 'x', 'a'])).toEqual(['c', 'a']);
    });
});

describe('isChartDataEmpty', () => {
    it('is empty without rows or numbers', () => {
        expect(isChartDataEmpty(undefined, ['a'])).toBe(true);
        expect(isChartDataEmpty([], ['a'])).toBe(true);
        expect(isChartDataEmpty([{ a: null }, { a: Number.NaN }], ['a'])).toBe(
            true,
        );
    });

    it('is not empty with one number, zero included', () => {
        expect(isChartDataEmpty([{ a: null }, { a: 0 }], ['a'])).toBe(false);
    });
});

describe('foldSmallSlices', () => {
    const options = {
        nameKey: 'name',
        valueKey: 'value',
        maxSlices: 3,
        otherName: 'Other',
    };

    it('keeps short lists as they are', () => {
        const data = [{ name: 'a', value: 1 }];
        expect(foldSmallSlices(data, options)).toEqual(data);
    });

    it('folds the smallest slices into Other', () => {
        const data = [
            { name: 'a', value: 1 },
            { name: 'b', value: 5 },
            { name: 'c', value: 2 },
            { name: 'd', value: 4 },
        ];
        expect(foldSmallSlices(data, options)).toEqual([
            { name: 'b', value: 5 },
            { name: 'd', value: 4 },
            { name: 'Other', value: 3 },
        ]);
    });
});

describe('chartQueryState', () => {
    const query = {
        isPending: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
    };

    it('loads only while pending without an error', () => {
        expect(chartQueryState({ ...query, isPending: true }).isLoading).toBe(
            true,
        );
        expect(
            chartQueryState({ ...query, isPending: true, error: new Error() })
                .isLoading,
        ).toBe(false);
    });

    it('marks background refetches and retries', () => {
        const state = chartQueryState({ ...query, isFetching: true });
        expect(state.isFetching).toBe(true);
        expect(state.error).toBeFalsy();
        state.onRetry();
        expect(query.refetch).toHaveBeenCalled();
    });
});

describe('cartesianTable', () => {
    it('makes an x column and one column per series', () => {
        const table = cartesianTable({
            data: [{ month: 1, sales: 1200 }],
            config: { sales: { label: 'Sales' }, visits: {} },
            xKey: 'month',
            xLabel: 'Month',
            xFormatter: (value) => `M${String(value)}`,
            keys: ['sales', 'visits'],
            formatValue: (value) => `$${value}`,
        });
        expect(table.columns.map((column) => column.label)).toEqual([
            'Month',
            'Sales',
            'visits',
        ]);
        expect(table.columns[0].format?.(1)).toBe('M1');
        expect(table.columns[1].format?.(1200)).toBe('$1200');
        expect(table.columns[1].format?.(null)).toBe('');
    });
});

describe('pointClickHandler', () => {
    const data = [{ a: 1 }, { a: 2 }];

    it('reports the datum under the pointer', () => {
        const onPointClick = vi.fn();
        const handler = pointClickHandler(data, onPointClick);
        handler?.({ activeTooltipIndex: '1' });
        expect(onPointClick).toHaveBeenCalledWith({ a: 2 }, 1);
    });

    it('ignores clicks outside the data', () => {
        const onPointClick = vi.fn();
        const handler = pointClickHandler(data, onPointClick);
        handler?.({ activeTooltipIndex: undefined });
        handler?.({ activeTooltipIndex: 5 });
        expect(onPointClick).not.toHaveBeenCalled();
    });

    it('is undefined without a callback', () => {
        expect(pointClickHandler(data)).toBeUndefined();
    });
});

describe('lastValueIndex', () => {
    it('skips trailing gaps', () => {
        const data = [{ v: 1 }, { v: 2 }, { v: null }, {}];
        expect(lastValueIndex(data, 'v')).toBe(1);
        expect(lastValueIndex([{ v: null }], 'v')).toBe(-1);
    });
});
