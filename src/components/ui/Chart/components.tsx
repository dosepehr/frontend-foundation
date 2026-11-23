/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import * as React from 'react';
import type {
    DefaultLegendContentProps,
    DefaultTooltipContentProps,
    TooltipValueType,
} from 'recharts';
import type { ChartIndicator } from './Chart.types';
import { useChart } from './hooks/useChart/useChart';
import {
    formatTooltipValue,
    getPayloadConfig,
} from './utils/chartConfig/chartConfig';

/** A short key in the series color; a filled box would be data ink. */
const Indicator = ({
    indicator,
    color,
    nested,
}: {
    indicator: ChartIndicator;
    color?: string;
    nested?: boolean;
}) => (
    <div
        data-slot="chart-indicator"
        className={cn(
            'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
            indicator === 'dot' && 'size-2.5',
            indicator === 'line' && 'w-1',
            indicator === 'dashed' &&
                'w-0 border-[1.5px] border-dashed bg-transparent',
            nested && indicator === 'dashed' && 'my-0.5',
        )}
        style={
            {
                '--color-bg': color,
                '--color-border': color,
            } as React.CSSProperties
        }
    />
);

type ChartTooltipContentProps = Partial<
    Omit<
        DefaultTooltipContentProps<TooltipValueType, string | number>,
        'accessibilityLayer'
    >
> & {
    active?: boolean;
    className?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: ChartIndicator;
    /** Config or data key of the row names, e.g. "browser" on a pie. */
    nameKey?: string;
    /** Config or data key of the label. */
    labelKey?: string;
    labelClassName?: string;
    color?: string;
    /** Formats each value; numbers get the locale grouping by default. */
    valueFormatter?: (value: number, name: string) => React.ReactNode;
};

/** Tooltip readout: every series at the hovered point, values first. */
const ChartTooltipContent = ({
    active,
    payload,
    className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    valueFormatter,
    color,
    nameKey,
    labelKey,
}: ChartTooltipContentProps) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const [first] = payload;
    const labelConfig = getPayloadConfig(
        config,
        first,
        `${labelKey ?? first?.dataKey ?? first?.name ?? 'value'}`,
    );
    const labelValue =
        !labelKey && typeof label === 'string'
            ? (config[label]?.label ?? label)
            : labelConfig?.label;
    const tooltipLabel = hideLabel ? null : labelFormatter ? (
        <div className={cn('font-medium', labelClassName)}>
            {labelFormatter(labelValue, payload)}
        </div>
    ) : labelValue ? (
        <div className={cn('font-medium', labelClassName)}>{labelValue}</div>
    ) : null;
    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
        <div
            data-slot="chart-tooltip"
            className={cn(
                'grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
                className,
            )}
        >
            {nestLabel ? null : tooltipLabel}
            <div className="grid gap-1.5">
                {payload
                    .filter((item) => item.type !== 'none')
                    .map((item, index) => {
                        const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
                        const itemConfig = getPayloadConfig(config, item, key);
                        const name = String(item.name ?? key);
                        const rowColor =
                            color ??
                            (item.payload as { fill?: string } | undefined)
                                ?.fill ??
                            item.color;

                        if (
                            formatter &&
                            item.value !== undefined &&
                            item.name
                        ) {
                            return (
                                <div key={index} className="flex w-full">
                                    {formatter(
                                        item.value,
                                        item.name,
                                        item,
                                        index,
                                        payload,
                                    )}
                                </div>
                            );
                        }
                        return (
                            <div
                                key={index}
                                className={cn(
                                    'flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground',
                                    indicator === 'dot' && 'items-center',
                                )}
                            >
                                {itemConfig?.icon ? (
                                    <itemConfig.icon />
                                ) : (
                                    !hideIndicator && (
                                        <Indicator
                                            indicator={indicator}
                                            color={rowColor}
                                            nested={nestLabel}
                                        />
                                    )
                                )}
                                <div
                                    className={cn(
                                        'flex flex-1 justify-between gap-4 leading-none',
                                        nestLabel
                                            ? 'items-end'
                                            : 'items-center',
                                    )}
                                >
                                    <div className="grid gap-1.5">
                                        {nestLabel ? tooltipLabel : null}
                                        <span className="text-muted-foreground">
                                            {itemConfig?.label ?? item.name}
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground tabular-nums">
                                        {formatTooltipValue(
                                            item.value,
                                            name,
                                            valueFormatter,
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

type ChartLegendContentProps = Pick<
    DefaultLegendContentProps,
    'payload' | 'verticalAlign'
> & {
    className?: string;
    hideIcon?: boolean;
    nameKey?: string;
    /** Mirrors the mark: a square for bars and areas, a line for lines. */
    shape?: 'square' | 'line';
    /** Makes each item a toggle button for its series. */
    onItemClick?: (key: string) => void;
    hiddenKeys?: ReadonlySet<string>;
};

const ChartLegendContent = ({
    className,
    hideIcon = false,
    payload,
    verticalAlign = 'bottom',
    nameKey,
    shape = 'square',
    onItemClick,
    hiddenKeys,
}: ChartLegendContentProps) => {
    const { config } = useChart();
    if (!payload?.length) return null;

    return (
        <div
            data-slot="chart-legend"
            className={cn(
                'flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5',
                verticalAlign === 'top' ? 'pb-3' : 'pt-3',
                className,
            )}
        >
            {payload
                .filter((item) => item.type !== 'none')
                .map((item, index) => {
                    const key = `${nameKey ?? item.dataKey ?? 'value'}`;
                    const itemConfig = getPayloadConfig(config, item, key);
                    const seriesKey = String(item.dataKey ?? item.value ?? key);
                    const hidden = hiddenKeys?.has(seriesKey) ?? false;
                    const content = (
                        <>
                            {itemConfig?.icon && !hideIcon ? (
                                <itemConfig.icon />
                            ) : (
                                <span
                                    aria-hidden
                                    className={cn(
                                        'shrink-0',
                                        shape === 'line'
                                            ? 'h-0.5 w-3 rounded-full'
                                            : 'size-2 rounded-[2px]',
                                    )}
                                    style={{ backgroundColor: item.color }}
                                />
                            )}
                            {itemConfig?.label ?? item.value}
                        </>
                    );
                    const itemClass =
                        'flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground';
                    return onItemClick ? (
                        <button
                            key={index}
                            type="button"
                            aria-pressed={!hidden}
                            onClick={() => onItemClick(seriesKey)}
                            className={cn(
                                itemClass,
                                'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                                hidden && 'opacity-40',
                            )}
                        >
                            {content}
                        </button>
                    ) : (
                        <div key={index} className={itemClass}>
                            {content}
                        </div>
                    );
                })}
        </div>
    );
};

export { ChartLegendContent, ChartTooltipContent };
