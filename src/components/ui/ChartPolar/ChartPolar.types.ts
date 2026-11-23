import type { ChartConfig } from '@/components/ui/Chart/Chart.types';
import type {
    ChartLegendOptions,
    ChartTooltipOptions,
} from '@/components/ui/ChartCartesian/ChartCartesian.types';
import type { ChartStateProps } from '@/components/ui/ChartFrame/ChartFrame.types';
import type { ChartLocale } from '@/utils/funcs/charts';
import type { ReactNode } from 'react';

/** The figure in the middle of a donut or radial chart. */
export type ChartCenterLabelOptions = {
    /** Defaults to the formatted total. */
    value?: ReactNode;
    label?: ReactNode;
};

/** Props shared by PieChart and RadialChart: one slice or ring per row. */
export type SliceChartProps<T extends object> = ChartStateProps & {
    data: readonly T[];
    /** Labels and colors of the categories, keyed by their `nameKey` value. */
    config: ChartConfig;
    nameKey: keyof T & string;
    valueKey: keyof T & string;
    /** Table headers of the name and value columns. */
    nameLabel?: string;
    valueLabel?: string;
    valueFormatter?: (value: number) => string;
    height?: number;
    /** Shown for two or more slices; `false` hides it. */
    legend?: false | ChartLegendOptions;
    tooltip?: false | Pick<ChartTooltipOptions, 'indicator'>;
    centerLabel?: false | ChartCenterLabelOptions;
    /** Slices that start hidden; the legend shows them again. */
    hiddenSlices?: string[];
    onSliceClick?: (datum: T, index: number) => void;
    animate?: boolean;
    'aria-label'?: string;
    showTable?: boolean;
    locale?: ChartLocale;
    className?: string;
};

export type ChartCenterLabelProps = {
    viewBox?: unknown;
    value: ReactNode;
    label?: ReactNode;
};
