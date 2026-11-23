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
import { Label, Pie, PieChart as RechartsPieChart } from 'recharts';
import { PieSliceLabel } from './components';
import type { PieChartProps } from './PieChart.types';

type PieLabelProps = Omit<Parameters<typeof PieSliceLabel>[0], 'format'>;

const OTHER = { en: 'Other', fa: 'سایر' } as const;

/** Part to whole, as a donut (default) or a pie; one slice per row. */
const PieChart = <T extends object>({
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
    donut = true,
    maxSlices = 6,
    otherLabel,
    showLabels = false,
    ...state
}: PieChartProps<T>) => {
    const pie = useSliceChart({
        data,
        config,
        nameKey,
        valueKey,
        nameLabel,
        valueLabel,
        hiddenSlices,
        maxSlices,
        otherName: otherLabel ?? OTHER[locale],
        locale,
        valueFormatter,
    });
    const center =
        donut && centerLabel !== false
            ? {
                  value: centerLabel?.value ?? pie.formatValue(pie.total),
                  label: centerLabel?.label,
              }
            : null;

    return (
        <ChartFrame
            {...state}
            locale={locale}
            isEmpty={pie.isEmpty}
            height={height}
            skeleton="pie"
            label={label}
            showTable={showTable}
            table={pie.table}
            className={className}
        >
            <ChartContainer
                config={pie.config}
                className={cn(
                    'aspect-auto size-full',
                    onSliceClick && 'cursor-pointer',
                )}
            >
                <RechartsPieChart accessibilityLayer>
                    {tooltip !== false && (
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey={nameKey}
                                    hideLabel
                                    indicator={tooltip?.indicator ?? 'dot'}
                                    valueFormatter={pie.formatValue}
                                />
                            }
                        />
                    )}
                    <Pie
                        data={pie.visible}
                        dataKey={valueKey}
                        nameKey={nameKey}
                        innerRadius={donut ? '60%' : 0}
                        outerRadius="80%"
                        // The surface-colored edge is the 2px gap between slices.
                        stroke="var(--chart-surface)"
                        strokeWidth={2}
                        isAnimationActive={animate ? 'auto' : false}
                        onClick={sliceClickHandler(data, nameKey, onSliceClick)}
                        labelLine={
                            showLabels ? { stroke: 'var(--border)' } : false
                        }
                        label={
                            showLabels
                                ? (props: PieLabelProps) => (
                                      <PieSliceLabel
                                          {...props}
                                          format={pie.formatShare}
                                      />
                                  )
                                : false
                        }
                    >
                        {center && (
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
                        )}
                    </Pie>
                    {legend !== false && pie.slices.length > 1 && (
                        <ChartLegend
                            verticalAlign={legend?.position ?? 'bottom'}
                            content={() => (
                                <ChartLegendContent
                                    payload={pie.legendPayload}
                                    verticalAlign={legend?.position ?? 'bottom'}
                                    hiddenKeys={pie.hidden}
                                    onItemClick={
                                        legend?.interactive === false
                                            ? undefined
                                            : pie.toggle
                                    }
                                />
                            )}
                        />
                    )}
                </RechartsPieChart>
            </ChartContainer>
        </ChartFrame>
    );
};

export default PieChart;
