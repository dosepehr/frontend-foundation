/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type { ChartConfig } from './Chart.types';
import { ChartContext } from './hooks/useChart/useChart';
import { buildChartCss } from './utils/chartConfig/chartConfig';

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

// Recharts' default strokes (#ccc, #fff) are swapped for theme tokens; the
// surface ring and gap of marks use --chart-surface (the card by default).
const CHART_CLASS = cn(
    'flex aspect-video justify-center text-xs [--chart-surface:var(--card)]',
    '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick_text]:tabular-nums',
    "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/70",
    '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
    "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
    "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
    '[&_.recharts-radial-bar-background-sector]:fill-muted',
    '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
    "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
    "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
    '[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden',
);

/** `--color-<key>` variables of the chart's config. */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const css = buildChartCss(id, config);
    if (!css) return null;
    // The CSS only holds config colors, never user text.
    return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

type ChartContainerProps = React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
        typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
    /** Size before the first measure; keeps the first paint stable. */
    initialDimension?: { width: number; height: number };
};

/**
 * Sizes a Recharts chart to its box and themes it. Give it a height,
 * `min-h-*` or `aspect-*` so it can measure on the first render.
 */
const ChartContainer = ({
    id,
    className,
    children,
    config,
    initialDimension = INITIAL_DIMENSION,
    ...props
}: ChartContainerProps) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id ?? uniqueId.replaceAll(':', '')}`;
    const value = React.useMemo(() => ({ config }), [config]);

    return (
        <ChartContext.Provider value={value}>
            <div
                data-slot="chart"
                data-chart={chartId}
                className={cn(CHART_CLASS, className)}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer
                    initialDimension={initialDimension}
                >
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
};

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;

export { ChartLegendContent, ChartTooltipContent } from './components';
export { useChart } from './hooks/useChart/useChart';
export { ChartContainer, ChartLegend, ChartStyle, ChartTooltip };
