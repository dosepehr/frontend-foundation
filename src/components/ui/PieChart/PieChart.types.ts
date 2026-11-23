import type { SliceChartProps } from '@/components/ui/ChartPolar/ChartPolar.types';

export type PieChartProps<T extends object> = SliceChartProps<T> & {
    /** A ring with the total in the middle; a full pie when false. */
    donut?: boolean;
    /**
     * Slices kept, "Other" included; the smallest fold into it. Past ~6,
     * parts of a whole stop reading — use a bar chart instead.
     */
    maxSlices?: number;
    /** Name of the folded slice; "Other" / «سایر» by default. */
    otherLabel?: string;
    /** Each slice's share beside it. */
    showLabels?: boolean;
};
