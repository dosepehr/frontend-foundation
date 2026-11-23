import type { ChartConfig } from '@/components/ui/Chart/Chart.types';
import type { ChartTable } from '@/components/ui/ChartFrame/ChartFrame.types';

/** Fill of the folded "Other" slice: neutral, never a categorical hue. */
export const OTHER_FILL = 'var(--muted-foreground)';
export const OTHER_KEY = '__other';

export type Slice = Record<string, unknown> & {
    fill: string;
    sliceKey: string;
};

const numberOf = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? value : 0;

/**
 * Rows with their fill: the config color of their name, else a slot by
 * row order, and gray for "Other".
 */
export function toSlices(
    rows: readonly Record<string, unknown>[],
    nameKey: string,
    config: ChartConfig,
): Slice[] {
    return rows.map((row, index) => {
        const key = String(row[nameKey]);
        const isOther = key === OTHER_KEY;
        return {
            ...row,
            sliceKey: key,
            fill: isOther
                ? OTHER_FILL
                : key in config
                  ? `var(--color-${key})`
                  : `var(--chart-${(index % 8) + 1})`,
        };
    });
}

export const sliceTotal = (rows: readonly object[], valueKey: string) =>
    rows.reduce(
        (sum, row) =>
            sum + numberOf((row as Record<string, unknown>)[valueKey]),
        0,
    );

/** Legend items for every slice, hidden ones included, so they toggle back. */
export const sliceLegendPayload = (slices: Slice[]) =>
    slices.map((slice) => ({
        value: slice.sliceKey,
        dataKey: slice.sliceKey,
        color: slice.fill,
        type: 'square' as const,
    }));

type SliceTableOptions = {
    rows: readonly Record<string, unknown>[];
    config: ChartConfig;
    nameKey: string;
    valueKey: string;
    nameLabel?: string;
    valueLabel?: string;
    otherName: string;
    formatValue: (value: number) => string;
    formatShare: (value: number) => string;
};

/** The table view of a part-to-whole chart: name, value and share. */
export function sliceTable({
    rows,
    config,
    nameKey,
    valueKey,
    nameLabel,
    valueLabel,
    otherName,
    formatValue,
    formatShare,
}: SliceTableOptions): ChartTable {
    const total = sliceTotal(rows, valueKey);
    return {
        rows: rows.map((row) => ({
            ...row,
            __share: total ? numberOf(row[valueKey]) / total : 0,
        })),
        columns: [
            {
                key: nameKey,
                label: nameLabel ?? nameKey,
                format: (value) => {
                    const key = String(value);
                    if (key === OTHER_KEY) return otherName;
                    return config[key]?.label ?? key;
                },
            },
            {
                key: valueKey,
                label: valueLabel ?? valueKey,
                format: (value) => formatValue(numberOf(value)),
            },
            {
                key: '__share',
                label: '%',
                format: (value) => formatShare(numberOf(value)),
            },
        ],
    };
}

/**
 * Reports the source row of a clicked slice; the folded "Other" slice has
 * no single row, so it reports nothing.
 */
export function sliceClickHandler<T extends object>(
    data: readonly T[],
    nameKey: string,
    onSliceClick?: (datum: T, index: number) => void,
) {
    if (!onSliceClick) return;
    return (slice: { payload?: { sliceKey?: string } }) => {
        const key = slice.payload?.sliceKey;
        const index = data.findIndex(
            (row) => String((row as Record<string, unknown>)[nameKey]) === key,
        );
        if (index !== -1) onSliceClick(data[index], index);
    };
}
