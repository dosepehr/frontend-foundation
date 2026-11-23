'use client';

import type { ChartConfig } from '@/components/ui/Chart/Chart.types';
import { useSeriesVisibility } from '@/hooks/useSeriesVisibility';
import {
    createNumberFormatter,
    foldSmallSlices,
    withSlotColors,
    type ChartLocale,
} from '@/utils/funcs/charts';
import { useMemo } from 'react';
import {
    OTHER_KEY,
    sliceLegendPayload,
    sliceTable,
    sliceTotal,
    toSlices,
} from '../../utils/slices/slices';

type UseSliceChartOptions = {
    data: readonly object[];
    config: ChartConfig;
    nameKey: string;
    valueKey: string;
    nameLabel?: string;
    valueLabel?: string;
    hiddenSlices?: string[];
    /** Slices kept before the rest fold into "Other"; no folding without it. */
    maxSlices?: number;
    otherName: string;
    locale: ChartLocale;
    valueFormatter?: (value: number) => string;
};

/** Slices of a part-to-whole chart: colors, folding, hiding, total, table. */
export function useSliceChart({
    data,
    config,
    nameKey,
    valueKey,
    nameLabel,
    valueLabel,
    hiddenSlices,
    maxSlices,
    otherName,
    locale,
    valueFormatter,
}: UseSliceChartOptions) {
    const colored = useMemo(
        () => ({
            ...withSlotColors(config),
            [OTHER_KEY]: { label: otherName },
        }),
        [config, otherName],
    );
    const rows = useMemo(
        () =>
            maxSlices
                ? foldSmallSlices(data, {
                      nameKey,
                      valueKey,
                      maxSlices,
                      otherName: OTHER_KEY,
                  })
                : [...(data as Record<string, unknown>[])],
        [data, nameKey, valueKey, maxSlices],
    );
    const slices = useMemo(
        () => toSlices(rows, nameKey, colored),
        [rows, nameKey, colored],
    );
    const keys = useMemo(() => slices.map((slice) => slice.sliceKey), [slices]);
    const { hidden, toggle } = useSeriesVisibility(keys, hiddenSlices);
    const visible = slices.filter((slice) => !hidden.has(slice.sliceKey));
    const formatValue = useMemo(
        () => valueFormatter ?? createNumberFormatter(locale),
        [valueFormatter, locale],
    );
    const formatShare = useMemo(
        () =>
            createNumberFormatter(locale, {
                style: 'percent',
                maximumFractionDigits: 1,
            }),
        [locale],
    );

    return {
        config: colored,
        slices,
        visible,
        hidden,
        toggle,
        total: sliceTotal(visible, valueKey),
        isEmpty: sliceTotal(slices, valueKey) === 0,
        formatValue,
        formatShare,
        legendPayload: sliceLegendPayload(slices),
        table: sliceTable({
            rows,
            config: colored,
            nameKey,
            valueKey,
            nameLabel,
            valueLabel,
            otherName,
            formatValue,
            formatShare,
        }),
    };
}
