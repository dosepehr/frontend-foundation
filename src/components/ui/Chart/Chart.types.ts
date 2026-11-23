import type { ComponentType, ReactNode } from 'react';

export type ChartTheme = 'light' | 'dark';

/**
 * Labels, icons and colors of a chart's series (or a pie's categories),
 * keyed like the data. Colors become `var(--color-<key>)` in the chart.
 */
export type ChartConfig = Record<
    string,
    { label?: ReactNode; icon?: ComponentType } & (
        | { color?: string; theme?: never }
        | { color?: never; theme: Record<ChartTheme, string> }
    )
>;

/** Key of a legend or tooltip row: a square for fills, a line for lines. */
export type ChartIndicator = 'dot' | 'line' | 'dashed';
