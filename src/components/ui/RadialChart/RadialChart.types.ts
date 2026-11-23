import type { SliceChartProps } from '@/components/ui/ChartPolar/ChartPolar.types';

export type RadialChartProps<T extends object> = SliceChartProps<T> & {
    /** Value of a full ring, e.g. 100 for percents or a goal. */
    max?: number;
    /** A half ring, like a gauge. */
    semicircle?: boolean;
};
