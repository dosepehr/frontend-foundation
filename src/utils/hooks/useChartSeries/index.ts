'use client';

import type { ChartConfig } from '@/components/ui/Chart/Chart.types';
import { useDirection } from '@/components/ui/Direction';
import { useSeriesVisibility } from '@/hooks/useSeriesVisibility';
import {
    createNumberFormatter,
    resolveSeries,
    withSlotColors,
    type ChartLocale,
} from '@/utils/funcs/charts';
import { useMemo } from 'react';

type UseChartSeriesOptions = {
    config: ChartConfig;
    series?: string[];
    hiddenSeries?: string[];
    locale?: ChartLocale;
    valueFormatter?: (value: number) => string;
    dir?: 'ltr' | 'rtl';
};

/**
 * What every chart derives from its props: colored config, the series to
 * plot, the ones hidden from the legend, a value formatter and direction.
 */
export function useChartSeries({
    config,
    series,
    hiddenSeries,
    locale = 'en',
    valueFormatter,
    dir,
}: UseChartSeriesOptions) {
    const colored = useMemo(() => withSlotColors(config), [config]);
    const seriesKey = series?.join('\u0000');
    const keys = useMemo(
        () => resolveSeries(colored, seriesKey?.split('\u0000')),
        [colored, seriesKey],
    );
    const visibility = useSeriesVisibility(keys, hiddenSeries);
    const formatValue = useMemo(
        () => valueFormatter ?? createNumberFormatter(locale),
        [valueFormatter, locale],
    );
    const isRtl = useDirection(dir) === 'rtl';

    return { config: colored, keys, formatValue, isRtl, ...visibility };
}
