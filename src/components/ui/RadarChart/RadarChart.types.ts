import type { CartesianChartProps } from '@/components/ui/ChartCartesian/ChartCartesian.types';
import type { SeriesDots } from '@/components/ui/ChartCartesian/utils/seriesDot/seriesDot';

export type RadarChartProps<T extends object> = Omit<
    CartesianChartProps<T>,
    | 'xKey'
    | 'xAxis'
    | 'yAxis'
    | 'grid'
    | 'referenceLines'
    | 'brush'
    | 'syncId'
    | 'onPointClick'
    | 'dir'
> & {
    /** Field of the spokes, e.g. a skill or a metric name. */
    angleKey: keyof T & string;
    /** Web of the grid: straight polygons or circles. */
    gridShape?: 'polygon' | 'circle';
    /** Fills each series with a 10% wash; outlines only when false. */
    filled?: boolean;
    dots?: Exclude<SeriesDots, 'end'>;
    /** Value at the rim; the data's max by default. */
    max?: number;
};
