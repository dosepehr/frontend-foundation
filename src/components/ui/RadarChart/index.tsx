/* c8 ignore start */
'use client';
/* c8 ignore stop */

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/Chart';
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
} from '@/utils/funcs/charts';
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart as RechartsRadarChart,
} from 'recharts';
import type { RadarChartProps } from './RadarChart.types';

/** Several measures of one or more series around a web of spokes. */
const RadarChart = <T extends object>({
    data,
    config,
    angleKey,
    xLabel,
    xFormatter,
    series,
    hiddenSeries,
    valueFormatter,
    height = 300,
    legend,
    tooltip,
    animate = true,
    'aria-label': label,
    showTable,
    locale = 'en',
    className,
    gridShape = 'polygon',
    filled = true,
    dots = 'none',
    max,
    ...state
}: RadarChartProps<T>) => {
    const chart = useChartSeries({
        config,
        series,
        hiddenSeries,
        locale,
        valueFormatter,
    });

    return (
        <ChartFrame
            {...state}
            locale={locale}
            isEmpty={isChartDataEmpty(data, chart.keys)}
            height={height}
            skeleton="radar"
            label={label}
            showTable={showTable}
            table={cartesianTable({
                data,
                config: chart.config,
                xKey: angleKey,
                xLabel,
                xFormatter,
                keys: chart.keys,
                formatValue: chart.formatValue,
            })}
            className={className}
        >
            <ChartContainer
                config={chart.config}
                className="aspect-auto size-full"
            >
                <RechartsRadarChart
                    accessibilityLayer
                    data={data as T[]}
                    outerRadius="75%"
                >
                    <PolarGrid gridType={gridShape} />
                    <PolarAngleAxis
                        dataKey={angleKey as string}
                        tickFormatter={xFormatter}
                        tick={{ className: 'fill-muted-foreground text-xs' }}
                    />
                    <PolarRadiusAxis
                        domain={[0, max ?? 'auto']}
                        tick={false}
                        axisLine={false}
                    />
                    {tooltip !== false && (
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    indicator={tooltip?.indicator ?? 'line'}
                                    hideLabel={tooltip?.hideLabel}
                                    labelFormatter={
                                        tooltip?.labelFormatter ??
                                        (xFormatter &&
                                            ((value) => xFormatter(value)))
                                    }
                                    valueFormatter={chart.formatValue}
                                />
                            }
                        />
                    )}
                    {chart.keys.map((key) => (
                        <Radar
                            key={key}
                            dataKey={key}
                            name={key}
                            stroke={`var(--color-${key})`}
                            strokeWidth={2}
                            fill={`var(--color-${key})`}
                            fillOpacity={filled ? 0.1 : 0}
                            dot={seriesDot(
                                dots,
                                `var(--color-${key})`,
                                lastValueIndex(data, key),
                            )}
                            activeDot={ACTIVE_DOT}
                            hide={chart.hidden.has(key)}
                            isAnimationActive={animate ? 'auto' : false}
                        />
                    ))}
                    {legend !== false && chart.keys.length > 1 && (
                        <ChartLegend
                            verticalAlign={legend?.position ?? 'bottom'}
                            content={
                                <ChartLegendContent
                                    shape="line"
                                    hiddenKeys={chart.hidden}
                                    onItemClick={
                                        legend?.interactive === false
                                            ? undefined
                                            : chart.toggle
                                    }
                                />
                            }
                        />
                    )}
                </RechartsRadarChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default RadarChart;
