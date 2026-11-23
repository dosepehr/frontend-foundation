/* c8 ignore start */
'use client';
/* c8 ignore stop */

import type { ChartCenterLabelProps } from './ChartPolar.types';

const hasCenter = (box: unknown): box is { cx: number; cy: number } =>
    typeof box === 'object' &&
    box !== null &&
    typeof (box as { cx?: unknown }).cx === 'number' &&
    typeof (box as { cy?: unknown }).cy === 'number';

/** The headline figure in the middle of a donut or radial chart. */
const ChartCenterLabel = ({ viewBox, value, label }: ChartCenterLabelProps) => {
    if (!hasCenter(viewBox)) return null;
    const { cx, cy } = viewBox;
    return (
        <text
            data-slot="chart-center-label"
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
        >
            <tspan
                x={cx}
                y={label ? cy - 8 : cy}
                className="fill-foreground text-2xl font-semibold"
            >
                {value}
            </tspan>
            {label && (
                <tspan
                    x={cx}
                    y={cy + 14}
                    className="fill-muted-foreground text-xs"
                >
                    {label}
                </tspan>
            )}
        </text>
    );
};

export default ChartCenterLabel;
