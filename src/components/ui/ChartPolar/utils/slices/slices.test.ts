import {
    OTHER_FILL,
    OTHER_KEY,
    sliceClickHandler,
    sliceLegendPayload,
    sliceTable,
    sliceTotal,
    toSlices,
} from './slices';

const CONFIG = { chrome: { label: 'Chrome' }, safari: { label: 'Safari' } };
const ROWS = [
    { browser: 'chrome', visitors: 300 },
    { browser: 'edge', visitors: 100 },
    { browser: OTHER_KEY, visitors: 100 },
];

describe('toSlices', () => {
    it('fills config names, unknown names and Other', () => {
        const slices = toSlices(ROWS, 'browser', CONFIG);
        expect(slices.map((slice) => slice.fill)).toEqual([
            'var(--color-chrome)',
            'var(--chart-2)',
            OTHER_FILL,
        ]);
        expect(slices[0].sliceKey).toBe('chrome');
    });
});

describe('sliceTotal', () => {
    it('sums numbers and skips the rest', () => {
        expect(sliceTotal([...ROWS, { visitors: null }], 'visitors')).toBe(500);
    });
});

describe('sliceLegendPayload', () => {
    it('lists every slice with its color', () => {
        expect(
            sliceLegendPayload(toSlices(ROWS, 'browser', CONFIG))[0],
        ).toEqual({
            value: 'chrome',
            dataKey: 'chrome',
            color: 'var(--color-chrome)',
            type: 'square',
        });
    });
});

describe('sliceTable', () => {
    it('adds the share of each slice', () => {
        const table = sliceTable({
            rows: ROWS,
            config: CONFIG,
            nameKey: 'browser',
            valueKey: 'visitors',
            nameLabel: 'Browser',
            otherName: 'Other',
            formatValue: String,
            formatShare: (value) => `${value * 100}%`,
        });
        expect(table.columns.map((column) => column.label)).toEqual([
            'Browser',
            'visitors',
            '%',
        ]);
        expect(table.columns[0].format?.('chrome')).toBe('Chrome');
        expect(table.columns[0].format?.(OTHER_KEY)).toBe('Other');
        expect(table.columns[0].format?.('edge')).toBe('edge');
        expect(
            table.columns[2].format?.(
                (table.rows[0] as { __share: number }).__share,
            ),
        ).toBe('60%');
    });

    it('has no shares for an empty total', () => {
        const table = sliceTable({
            rows: [{ browser: 'chrome', visitors: 0 }],
            config: CONFIG,
            nameKey: 'browser',
            valueKey: 'visitors',
            otherName: 'Other',
            formatValue: String,
            formatShare: String,
        });
        expect((table.rows[0] as { __share: number }).__share).toBe(0);
    });
});

describe('sliceClickHandler', () => {
    it('reports the source row of a slice', () => {
        const onSliceClick = vi.fn();
        sliceClickHandler(
            ROWS,
            'browser',
            onSliceClick,
        )?.({
            payload: { sliceKey: 'edge' },
        });
        expect(onSliceClick).toHaveBeenCalledWith(ROWS[1], 1);
    });

    it('ignores slices without a source row', () => {
        const onSliceClick = vi.fn();
        sliceClickHandler(
            [{ browser: 'chrome' }],
            'browser',
            onSliceClick,
        )?.({
            payload: { sliceKey: OTHER_KEY },
        });
        expect(onSliceClick).not.toHaveBeenCalled();
        expect(sliceClickHandler(ROWS, 'browser')).toBeUndefined();
    });
});
