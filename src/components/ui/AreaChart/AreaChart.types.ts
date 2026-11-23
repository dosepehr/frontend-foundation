import type { CartesianChartProps } from '@/components/ui/ChartCartesian/ChartCartesian.types';
import type { SeriesDots } from '@/components/ui/ChartCartesian/utils/seriesDot/seriesDot';
import type { CurveType } from 'recharts';

export type AreaChartProps<T extends object> = CartesianChartProps<T> & {
    curve?: CurveType;
    /** Overlapping, stacked, or stacked to 100%. */
    stack?: 'none' | 'stacked' | 'percent';
    /** A flat 10% wash of the series hue, or a gradient fading down. */
    fill?: 'wash' | 'gradient';
    dots?: SeriesDots;
    connectNulls?: boolean;
};
