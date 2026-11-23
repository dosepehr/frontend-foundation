/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { ChartContainer } from '@/components/ui/Chart';
import ChartCartesianLayers from '@/components/ui/ChartCartesian';
import ChartFrame from '@/components/ui/ChartFrame';
import { useChartSeries } from '@/hooks/useChartSeries';
import {
    cartesianTable,
    isChartDataEmpty,
    pointClickHandler,
} from '@/utils/funcs/charts';
import { cn } from '@/utils/funcs/cn';
import { Bar, Cell, LabelList, BarChart as RechartsBarChart } from 'recharts';
import type { BarChartProps } from './BarChart.types';
import { BarValueLabel } from './components';
import { getBarRadius } from './utils/barRadius/barRadius';

// Bars the highlight leaves out: the same mark, grayed.
const MUTED_FILL =
    'color-mix(in oklch, var(--muted-foreground) 30%, transparent)';

/** Columns or bars from any rows; series come from `config`. */
const BarChart = <T extends object>({
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
    orientation = 'vertical',
    stack = 'none',
    showValues = false,
    highlight,
    maxBarSize = 24,
    ...state
}: BarChartProps<T>) => {
    const chart = useChartSeries({
        config,
        series,
        hiddenSeries,
        locale,
        valueFormatter,
        dir,
    });
    const isHorizontal = orientation === 'horizontal';
    const isStacked = stack !== 'none';
    const lastVisible = chart.visibleKeys.at(-1);

    return (
        <ChartFrame
            {...state}
            locale={locale}
            isEmpty={isChartDataEmpty(data, chart.keys)}
            height={height}
            skeleton="bar"
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
                <RechartsBarChart
                    accessibilityLayer
                    data={data as T[]}
                    layout={isHorizontal ? 'vertical' : 'horizontal'}
                    stackOffset={stack === 'percent' ? 'expand' : undefined}
                    barGap={2}
                    syncId={syncId}
                    onClick={pointClickHandler(data, onPointClick)}
                    margin={{
                        top: showValues ? 20 : 8,
                        right: 12,
                        left: 12,
                        bottom: 0,
                    }}
                >
                    <ChartCartesianLayers
                        xKey={xKey}
                        layout={isHorizontal ? 'vertical' : 'horizontal'}
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
                        defaultIndicator="dot"
                        referenceLines={referenceLines}
                        brush={brush}
                    />
                    {chart.keys.map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            name={key}
                            fill={`var(--color-${key})`}
                            hide={chart.hidden.has(key)}
                            stackId={isStacked ? 'stack' : undefined}
                            maxBarSize={maxBarSize}
                            radius={
                                !isStacked || key === lastVisible
                                    ? getBarRadius(isHorizontal, chart.isRtl)
                                    : 0
                            }
                            // A surface-colored edge is the 2px gap between stacked segments.
                            stroke={
                                isStacked ? 'var(--chart-surface)' : undefined
                            }
                            strokeWidth={isStacked ? 2 : 0}
                            isAnimationActive={animate ? 'auto' : false}
                        >
                            {highlight &&
                                data.map((datum, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            highlight(datum, index)
                                                ? `var(--color-${key})`
                                                : MUTED_FILL
                                        }
                                    />
                                ))}
                            {showValues && !isStacked && (
                                <LabelList
                                    dataKey={key}
                                    content={(props) => (
                                        <BarValueLabel
                                            {...props}
                                            horizontal={isHorizontal}
                                            rtl={chart.isRtl}
                                            format={chart.formatValue}
                                        />
                                    )}
                                />
                            )}
                        </Bar>
                    ))}
                </RechartsBarChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default BarChart;
