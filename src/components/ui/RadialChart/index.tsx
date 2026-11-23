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
import ChartFrame from '@/components/ui/ChartFrame';
import ChartCenterLabel from '@/components/ui/ChartPolar';
import { useSliceChart } from '@/components/ui/ChartPolar/hooks/useSliceChart/useSliceChart';
import { sliceClickHandler } from '@/components/ui/ChartPolar/utils/slices/slices';
import { cn } from '@/utils/funcs/cn';
import {
    Label,
    PolarAngleAxis,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from 'recharts';
import type { RadialChartProps } from './RadialChart.types';

/**
 * Progress toward a max as rings, one per row; a single row with `max`
 * and `semicircle` is a gauge.
 */
const RadialChart = <T extends object>({
    data,
    config,
    nameKey,
    valueKey,
    nameLabel,
    valueLabel,
    valueFormatter,
    height = 300,
    legend,
    tooltip,
    centerLabel,
    hiddenSlices,
    onSliceClick,
    animate = true,
    'aria-label': label,
    showTable,
    locale = 'en',
    className,
    max,
    semicircle = false,
    ...state
}: RadialChartProps<T>) => {
    const radial = useSliceChart({
        data,
        config,
        nameKey,
        valueKey,
        nameLabel,
        valueLabel,
        hiddenSlices,
        otherName: '',
        locale,
        valueFormatter,
    });
    const center =
        centerLabel !== false
            ? {
                  value: centerLabel?.value ?? radial.formatValue(radial.total),
                  label: centerLabel?.label,
              }
            : null;

    return (
        <ChartFrame
            {...state}
            locale={locale}
            isEmpty={radial.isEmpty}
            height={height}
            skeleton="radial"
            label={label}
            showTable={showTable}
            table={radial.table}
            className={className}
        >
            <ChartContainer
                config={radial.config}
                className={cn(
                    'aspect-auto size-full',
                    onSliceClick && 'cursor-pointer',
                )}
            >
                <RadialBarChart
                    accessibilityLayer
                    data={radial.visible}
                    innerRadius="35%"
                    outerRadius="90%"
                    startAngle={semicircle ? 180 : 90}
                    endAngle={semicircle ? 0 : -270}
                    cy={semicircle ? '70%' : '50%'}
                    barCategoryGap="20%"
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, max ?? 'dataMax']}
                        tick={false}
                        axisLine={false}
                    />
                    {tooltip !== false && (
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    nameKey={nameKey}
                                    hideLabel
                                    indicator={tooltip?.indicator ?? 'dot'}
                                    valueFormatter={radial.formatValue}
                                />
                            }
                        />
                    )}
                    <RadialBar
                        dataKey={valueKey as string}
                        background
                        cornerRadius={4}
                        onClick={sliceClickHandler(data, nameKey, onSliceClick)}
                        isAnimationActive={animate ? 'auto' : false}
                    />
                    {center && (
                        <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                        >
                            <Label
                                position="center"
                                content={({ viewBox }) => (
                                    <ChartCenterLabel
                                        viewBox={viewBox}
                                        value={center.value}
                                        label={center.label}
                                    />
                                )}
                            />
                        </PolarRadiusAxis>
                    )}
                    {legend !== false && radial.slices.length > 1 && (
                        <ChartLegend
                            verticalAlign={legend?.position ?? 'bottom'}
                            content={() => (
                                <ChartLegendContent
                                    payload={radial.legendPayload}
                                    verticalAlign={legend?.position ?? 'bottom'}
                                    hiddenKeys={radial.hidden}
                                    onItemClick={
                                        legend?.interactive === false
                                            ? undefined
                                            : radial.toggle
                                    }
                                />
                            )}
                        />
                    )}
                </RadialBarChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default RadialChart;
