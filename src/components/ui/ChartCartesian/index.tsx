/* c8 ignore start */
'use client';
/* c8 ignore stop */

import {
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/Chart';
import {
    createCompactFormatter,
    createPercentFormatter,
} from '@/utils/funcs/charts';
import { Brush, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import type {
    ChartAxisOptions,
    ChartCartesianLayersProps,
    ChartReferenceLine,
} from './ChartCartesian.types';

const TONE_STROKE: Record<NonNullable<ChartReferenceLine['tone']>, string> = {
    neutral: 'var(--muted-foreground)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    destructive: 'var(--destructive)',
};

const AXIS = { tickLine: false, axisLine: false, tickMargin: 8 } as const;

/** A numeric or time x axis spaces points by their real distance. */
const continuousX = ({ type, domain }: ChartAxisOptions) =>
    type === 'number' || type === 'time'
        ? {
              type: 'number' as const,
              scale: type === 'time' ? ('time' as const) : ('auto' as const),
              domain: domain ?? ['dataMin', 'dataMax'],
          }
        : {};

/**
 * Grid, axes, tooltip, legend, reference lines and brush of a cartesian
 * chart. Renders inside a Recharts chart; RTL mirrors the axes.
 */
const ChartCartesianLayers = ({
    xKey,
    layout = 'horizontal',
    isRtl,
    percent = false,
    locale,
    formatValue,
    xFormatter,
    grid = true,
    xAxis,
    yAxis,
    showLegend,
    legend,
    legendShape,
    hidden,
    onToggle,
    tooltip,
    defaultIndicator,
    referenceLines,
    brush,
}: ChartCartesianLayersProps) => {
    const isVertical = layout === 'vertical';
    const valueTicks = percent
        ? createPercentFormatter(locale)
        : createCompactFormatter(locale);
    const xOptions = xAxis || {};
    const yOptions = yAxis || {};
    // Gridlines run across the value axis: rows for columns, columns for bars.
    const rows =
        grid === 'both' ||
        grid === 'horizontal' ||
        (grid === true && !isVertical);
    const cols =
        grid === 'both' || grid === 'vertical' || (grid === true && isVertical);
    const categoryFormatter = xOptions.tickFormatter ?? xFormatter;

    return (
        <>
            {grid !== false && (
                <CartesianGrid horizontal={rows} vertical={cols} />
            )}
            {xAxis !== false && (
                <XAxis
                    {...AXIS}
                    reversed={isRtl}
                    minTickGap={16}
                    {...(isVertical
                        ? {
                              type: 'number' as const,
                              tickFormatter:
                                  xOptions.tickFormatter ?? valueTicks,
                              domain: xOptions.domain,
                              allowDecimals: xOptions.allowDecimals,
                              tickCount: xOptions.tickCount,
                          }
                        : {
                              dataKey: xKey,
                              tickFormatter: categoryFormatter,
                              ...continuousX(xOptions),
                          })}
                />
            )}
            {yAxis !== false && (
                <YAxis
                    {...AXIS}
                    orientation={isRtl ? 'right' : 'left'}
                    width={yOptions.width ?? 'auto'}
                    {...(isVertical
                        ? {
                              type: 'category' as const,
                              dataKey: xKey,
                              tickFormatter:
                                  yOptions.tickFormatter ?? xFormatter,
                          }
                        : {
                              tickFormatter:
                                  yOptions.tickFormatter ?? valueTicks,
                              domain: yOptions.domain,
                              allowDecimals: yOptions.allowDecimals,
                              tickCount: yOptions.tickCount,
                          })}
                />
            )}
            {referenceLines?.map(
                ({ axis = 'y', value, label, tone = 'neutral' }) => (
                    <ReferenceLine
                        key={`${axis}-${value}`}
                        {...{ [axis]: value }}
                        stroke={TONE_STROKE[tone]}
                        strokeDasharray="4 4"
                        ifOverflow="extendDomain"
                        label={
                            label
                                ? {
                                      value: label,
                                      position: isRtl
                                          ? 'insideTopLeft'
                                          : 'insideTopRight',
                                      className:
                                          'fill-muted-foreground text-xs',
                                  }
                                : undefined
                        }
                    />
                ),
            )}
            {tooltip !== false && (
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            indicator={tooltip?.indicator ?? defaultIndicator}
                            hideLabel={tooltip?.hideLabel}
                            labelFormatter={
                                tooltip?.labelFormatter ??
                                (xFormatter && ((label) => xFormatter(label)))
                            }
                            valueFormatter={formatValue}
                        />
                    }
                />
            )}
            {showLegend && (
                <ChartLegend
                    verticalAlign={legend.position ?? 'bottom'}
                    content={
                        <ChartLegendContent
                            shape={legendShape}
                            hiddenKeys={hidden}
                            onItemClick={
                                legend.interactive === false
                                    ? undefined
                                    : onToggle
                            }
                        />
                    }
                />
            )}
            {brush && (
                <Brush
                    dataKey={xKey}
                    height={24}
                    travellerWidth={8}
                    stroke="var(--border)"
                    fill="var(--chart-surface)"
                    tickFormatter={categoryFormatter}
                />
            )}
        </>
    );
};

export default ChartCartesianLayers;
