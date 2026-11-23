import type { CartesianChartProps } from '@/components/ui/ChartCartesian/ChartCartesian.types';
import type { SeriesDots } from '@/components/ui/ChartCartesian/utils/seriesDot/seriesDot';
import type { CurveType } from 'recharts';

export type LineChartProps<T extends object> = CartesianChartProps<T> & {
    /** Interpolation between points; "monotone" never overshoots. */
    curve?: CurveType;
    /** Point markers: none, the last point only, or every point. */
    dots?: SeriesDots;
    /** Draws across missing values instead of breaking the line. */
    connectNulls?: boolean;
    /** Series drawn dashed, e.g. a forecast or a previous period. */
    dashedSeries?: string[];
};
