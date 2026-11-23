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
import { Line, LineChart as RechartsLineChart } from 'recharts';
import type { LineChartProps } from './LineChart.types';

/** Change over time for one or more series; series come from `config`. */
const LineChart = <T extends object>({
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
    dots = 'none',
    connectNulls = false,
    dashedSeries,
    ...state
}: LineChartProps<T>) => {
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
                <RechartsLineChart
                    accessibilityLayer
                    data={data as T[]}
                    syncId={syncId}
                    onClick={pointClickHandler(data, onPointClick)}
                    margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
                >
                    <ChartCartesianLayers
                        xKey={xKey}
                        isRtl={chart.isRtl}
                        locale={locale}
                        formatValue={chart.formatValue}
                        xFormatter={xFormatter}
                        grid={grid}
                        xAxis={xAxis}
                        yAxis={yAxis}
                        showLegend={legend !== false && chart.keys.length > 1}
                        legend={legend || {}}
                        legendShape="line"
                        hidden={chart.hidden}
                        onToggle={chart.toggle}
                        tooltip={tooltip}
                        defaultIndicator="line"
                        referenceLines={referenceLines}
                        brush={brush}
                    />
                    {chart.keys.map((key) => (
                        <Line
                            key={key}
                            dataKey={key}
                            name={key}
                            type={curve}
                            stroke={`var(--color-${key})`}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={
                                dashedSeries?.includes(key) ? '6 4' : undefined
                            }
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
                </RechartsLineChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default LineChart;
