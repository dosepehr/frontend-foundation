import type { ChartFrameProps, ChartFrameState } from '../../ChartFrame.types';

/** Which state a chart frame shows; an error wins over stale data. */
export function getChartFrameState({
    isLoading,
    error,
    isEmpty,
}: Pick<ChartFrameProps, 'isLoading' | 'error' | 'isEmpty'>): ChartFrameState {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (isEmpty) return 'empty';
    return 'ready';
}
