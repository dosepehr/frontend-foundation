import type {
    ChartConfig,
    ChartIndicator,
} from '@/components/ui/Chart/Chart.types';
import type { ChartStateProps } from '@/components/ui/ChartFrame/ChartFrame.types';
import type { ChartLocale } from '@/utils/funcs/charts';
import type { ReactNode } from 'react';
import type { AxisDomain } from 'recharts';

export type ChartAxisOptions = {
    /**
     * Scale of the x values: evenly spaced categories, or numbers and
     * timestamps (ms) spaced by their real distance.
     */
    type?: 'category' | 'number' | 'time';
    tickFormatter?: (value: string | number, index: number) => string;
    domain?: AxisDomain;
    /** Width of the y axis in px; "auto" fits the longest tick. */
    width?: number | 'auto';
    tickCount?: number;
    allowDecimals?: boolean;
};

/** A threshold or target line; tones other than neutral mean status. */
export type ChartReferenceLine = {
    axis?: 'x' | 'y';
    value: number | string;
    label?: string;
    tone?: 'neutral' | 'success' | 'warning' | 'destructive';
};

export type ChartLegendOptions = {
    position?: 'top' | 'bottom';
    /** Legend items toggle their series. On by default. */
    interactive?: boolean;
};

export type ChartTooltipOptions = {
    indicator?: ChartIndicator;
    hideLabel?: boolean;
    labelFormatter?: (label: unknown) => ReactNode;
};

/** Props shared by AreaChart, LineChart and BarChart. */
export type CartesianChartProps<T extends object> = ChartStateProps & {
    data: readonly T[];
    /** Labels and colors of the series, keyed like the data. */
    config: ChartConfig;
    /** Field of the category or time axis. */
    xKey: keyof T & string;
    /** Header of the x column in the table view. */
    xLabel?: string;
    /** Formats x values in ticks, the tooltip label and the table. */
    xFormatter?: (value: unknown) => string;
    /** Config keys to plot, in this order; every key by default. */
    series?: string[];
    /** Series that start hidden; the legend shows them again. */
    hiddenSeries?: string[];
    /** Formats values in the tooltip and table; locale grouping by default. */
    valueFormatter?: (value: number) => string;
    /** Plot height in px, axis band included. */
    height?: number;
    grid?: boolean | 'horizontal' | 'vertical' | 'both';
    xAxis?: false | ChartAxisOptions;
    yAxis?: false | ChartAxisOptions;
    /** Shown for two or more series; `false` hides it. */
    legend?: false | ChartLegendOptions;
    tooltip?: false | ChartTooltipOptions;
    referenceLines?: ChartReferenceLine[];
    /** A range slider under the plot for long series. */
    brush?: boolean;
    /** Charts with the same id share their tooltip position. */
    syncId?: string;
    onPointClick?: (datum: T, index: number) => void;
    animate?: boolean;
    /** Names the chart for screen readers and captions the table. */
    'aria-label'?: string;
    /** Shows the table view under the chart, not only to screen readers. */
    showTable?: boolean;
    dir?: 'ltr' | 'rtl';
    locale?: ChartLocale;
    className?: string;
};

export type ChartCartesianLayersProps = {
    xKey: string;
    /** "vertical" puts categories on the y axis (horizontal bars). */
    layout?: 'horizontal' | 'vertical';
    isRtl: boolean;
    percent?: boolean;
    locale: ChartLocale;
    formatValue: (value: number) => string;
    xFormatter?: (value: unknown) => string;
    grid: CartesianChartProps<object>['grid'];
    xAxis: CartesianChartProps<object>['xAxis'];
    yAxis: CartesianChartProps<object>['yAxis'];
    showLegend: boolean;
    legend: ChartLegendOptions;
    legendShape: 'square' | 'line';
    hidden: ReadonlySet<string>;
    onToggle: (key: string) => void;
    tooltip: CartesianChartProps<object>['tooltip'];
    defaultIndicator: ChartIndicator;
    referenceLines?: ChartReferenceLine[];
    brush?: boolean;
};
