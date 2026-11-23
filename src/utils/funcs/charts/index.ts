// Pure helpers shared by the chart components: series and colors from a
// ChartConfig, locale-aware number formatting, empty-data checks, folding
// small pie slices, and chart state from a React Query result.
import type { ChartConfig } from '@/components/ui/Chart/Chart.types';
import type { ChartTable } from '@/components/ui/ChartFrame/ChartFrame.types';

export type ChartLocale = 'en' | 'fa';

/** Categorical slots in the theme; a 9th series folds or facets instead. */
export const CHART_SLOT_COUNT = 8;

const INTL_LOCALE: Record<ChartLocale, string> = { en: 'en-US', fa: 'fa-IR' };

/** Formats numbers with the locale's digits and grouping, e.g. "۱٬۲۸۴". */
export function createNumberFormatter(
    locale: ChartLocale = 'en',
    options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
) {
    const format = new Intl.NumberFormat(INTL_LOCALE[locale], options);
    return (value: number) => format.format(value);
}

/** Compact axis ticks: 1,284 → "1.3K" (or "۱٫۳ هزار"). */
export const createCompactFormatter = (locale: ChartLocale = 'en') =>
    createNumberFormatter(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
    });

/** Ticks of a 0–1 percent stack: 0.25 → "25%". */
export const createPercentFormatter = (locale: ChartLocale = 'en') =>
    createNumberFormatter(locale, { style: 'percent' });

/**
 * Gives every config entry a color, by its position in the config — so a
 * series keeps its hue when others are filtered out or hidden.
 */
export function withSlotColors(config: ChartConfig): ChartConfig {
    return Object.fromEntries(
        Object.entries(config).map(([key, item], index) => [
            key,
            item.color || item.theme
                ? item
                : {
                      ...item,
                      color: `var(--chart-${(index % CHART_SLOT_COUNT) + 1})`,
                  },
        ]),
    );
}

/** The series to plot: `series` in its order, else every config key. */
export function resolveSeries(config: ChartConfig, series?: string[]) {
    const keys = series ?? Object.keys(config);
    return keys.filter((key) => key in config);
}

/** True when there are no rows, or no row has a number for any key. */
export function isChartDataEmpty(
    data: readonly object[] | undefined,
    keys: string[],
) {
    if (!data?.length) return true;
    return !data.some((row) =>
        keys.some((key) => {
            const value = (row as Record<string, unknown>)[key];
            return typeof value === 'number' && Number.isFinite(value);
        }),
    );
}

/** Index of the last row with a number for `key`; -1 when there is none. */
export function lastValueIndex(data: readonly object[], key: string) {
    for (let index = data.length - 1; index >= 0; index--) {
        const value = (data[index] as Record<string, unknown>)[key];
        if (typeof value === 'number' && Number.isFinite(value)) return index;
    }
    return -1;
}

type FoldOptions = {
    nameKey: string;
    valueKey: string;
    /** Slices kept, the "Other" slice included. */
    maxSlices: number;
    otherName: string;
};

/**
 * Keeps the largest slices and sums the rest into one "Other" slice, so a
 * part-to-whole chart never needs more hues than it has slots.
 */
export function foldSmallSlices<T extends object>(
    data: readonly T[],
    { nameKey, valueKey, maxSlices, otherName }: FoldOptions,
): Record<string, unknown>[] {
    const rows = data as readonly Record<string, unknown>[];
    if (rows.length <= maxSlices) return [...rows];
    const value = (row: Record<string, unknown>) =>
        typeof row[valueKey] === 'number' ? (row[valueKey] as number) : 0;
    const sorted = [...rows].sort((a, b) => value(b) - value(a));
    const kept = sorted.slice(0, maxSlices - 1);
    const rest = sorted.slice(maxSlices - 1);
    const other = rest.reduce((sum, row) => sum + value(row), 0);
    return [...kept, { [nameKey]: otherName, [valueKey]: other }];
}

/** The parts of a React Query result a chart reads. */
type QueryLike = {
    isPending: boolean;
    isFetching: boolean;
    error: unknown;
    refetch: () => unknown;
};

/** Chart state props from a query: `<BarChart {...chartQueryState(q)} />`. */
export function chartQueryState(query: QueryLike) {
    return {
        isLoading: query.isPending && !query.error,
        isFetching: query.isFetching && !query.isPending,
        error: query.error,
        onRetry: () => {
            void query.refetch();
        },
    };
}

type CartesianTableOptions = {
    data: readonly object[];
    config: ChartConfig;
    xKey: string;
    xLabel?: string;
    xFormatter?: (value: unknown) => string;
    keys: string[];
    formatValue: (value: number) => string;
};

/** The table view of a cartesian chart: one row per x, one column per series. */
export function cartesianTable({
    data,
    config,
    xKey,
    xLabel,
    xFormatter,
    keys,
    formatValue,
}: CartesianTableOptions): ChartTable {
    return {
        rows: data,
        columns: [
            {
                key: xKey,
                label: xLabel ?? xKey,
                format: xFormatter && ((value) => xFormatter(value)),
            },
            ...keys.map((key) => ({
                key,
                label: config[key]?.label ?? key,
                format: (value: unknown) =>
                    typeof value === 'number' ? formatValue(value) : '',
            })),
        ],
    };
}

/**
 * A chart-level onClick that reports the datum under the pointer; Recharts
 * gives the active index as a number or a numeric string.
 */
export function pointClickHandler<T>(
    data: readonly T[],
    onPointClick?: (datum: T, index: number) => void,
) {
    if (!onPointClick) return;
    return (state: { activeTooltipIndex?: unknown }) => {
        const index = Number(state.activeTooltipIndex);
        if (Number.isInteger(index) && data[index] !== undefined) {
            onPointClick(data[index], index);
        }
    };
}
