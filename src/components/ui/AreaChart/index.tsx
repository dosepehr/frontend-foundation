/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { ChartContainer } from '@/components/ui/Chart';
import ChartCartesianLayers from '@/components/ui/ChartCartesian';
import {
    ACTIVE_DOT,
    seriesDot,
} from '@/components/ui/ChartCartesian/utils/seriesDot/seriesDot';
import ChartFrame from '@/components/ui/ChartFrame';
import { useChartSeries } from '@/hooks/useChartSeries';
import {
    cartesianTable,
    isChartDataEmpty,
    lastValueIndex,
    pointClickHandler,
} from '@/utils/funcs/charts';
import { cn } from '@/utils/funcs/cn';
import { useId } from 'react';
import { Area, AreaChart as RechartsAreaChart } from 'recharts';
import type { AreaChartProps } from './AreaChart.types';

/** Volume over time, overlapping or stacked; series come from `config`. */
const AreaChart = <T extends object>({
    data,
    config,
    xKey,
    xLabel,
    xFormatter,
    series,
    hiddenSeries,
    valueFormatter,
    height = 300,
    grid,
    xAxis,
    yAxis,
    legend,
    tooltip,
    referenceLines,
    brush,
    syncId,
    onPointClick,
    animate = true,
    'aria-label': label,
    showTable,
    dir,
    locale = 'en',
    className,
    curve = 'monotone',
    stack = 'none',
    fill = 'wash',
    dots = 'none',
    connectNulls = false,
    ...state
}: AreaChartProps<T>) => {
    const gradientId = useId().replaceAll(':', '');
    const chart = useChartSeries({
        config,
        series,
        hiddenSeries,
        locale,
        valueFormatter,
        dir,
    });

    return (
        <ChartFrame
            {...state}
            locale={locale}
            isEmpty={isChartDataEmpty(data, chart.keys)}
            height={height}
            label={label}
            showTable={showTable}
            table={cartesianTable({
                data,
                config: chart.config,
                xKey,
                xLabel,
                xFormatter,
                keys: chart.keys,
                formatValue: chart.formatValue,
            })}
            className={className}
        >
            <ChartContainer
                config={chart.config}
                className={cn(
                    'aspect-auto size-full',
                    onPointClick && 'cursor-pointer',
                )}
            >
                <RechartsAreaChart
                    accessibilityLayer
                    data={data as T[]}
                    stackOffset={stack === 'percent' ? 'expand' : undefined}
                    syncId={syncId}
                    onClick={pointClickHandler(data, onPointClick)}
                    margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
                >
                    {fill === 'gradient' && (
                        <defs>
                            {chart.keys.map((key) => (
                                <linearGradient
                                    key={key}
                                    id={`${gradientId}-${key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={`var(--color-${key})`}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                    )}
                    <ChartCartesianLayers
                        xKey={xKey}
                        isRtl={chart.isRtl}
                        percent={stack === 'percent'}
                        locale={locale}
                        formatValue={chart.formatValue}
                        xFormatter={xFormatter}
                        grid={grid}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        showLegend={legend !== false && chart.keys.length > 1}
                        legend={legend || {}}
                        legendShape="square"
                        hidden={chart.hidden}
                        onToggle={chart.toggle}
                        tooltip={tooltip}
                        defaultIndicator="line"
                        referenceLines={referenceLines}
                        brush={brush}
                    />
                    {chart.keys.map((key) => (
                        <Area
                            key={key}
                            dataKey={key}
                            name={key}
                            type={curve}
                            stroke={`var(--color-${key})`}
                            strokeWidth={2}
                            fill={
                                fill === 'gradient'
                                    ? `url(#${gradientId}-${key})`
                                    : `var(--color-${key})`
                            }
                            fillOpacity={fill === 'gradient' ? 1 : 0.1}
                            stackId={stack === 'none' ? undefined : 'stack'}
                            dot={seriesDot(
                                dots,
                                `var(--color-${key})`,
                                lastValueIndex(data, key),
                            )}
                            activeDot={ACTIVE_DOT}
                            connectNulls={connectNulls}
                            hide={chart.hidden.has(key)}
                            isAnimationActive={animate ? 'auto' : false}
                        />
                    ))}
                </RechartsAreaChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default AreaChart;
