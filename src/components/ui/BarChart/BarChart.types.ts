import type { CartesianChartProps } from '@/components/ui/ChartCartesian/ChartCartesian.types';

export type BarChartProps<T extends object> = CartesianChartProps<T> & {
    /** "vertical" draws columns; "horizontal" draws bars along the x axis. */
    orientation?: 'vertical' | 'horizontal';
    /** Side by side, stacked, or stacked to 100%. */
    stack?: 'none' | 'stacked' | 'percent';
    /** Values at the bar ends (not on stacks: the tooltip carries those). */
    showValues?: boolean;
    /** Emphasis: bars it returns false for are grayed out. */
    highlight?: (datum: T, index: number) => boolean;
    /** Thickest bar in px; thin marks read calmer. */
    maxBarSize?: number;
};
