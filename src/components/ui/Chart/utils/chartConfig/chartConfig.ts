import type { ReactNode } from 'react';
import type { ChartConfig, ChartTheme } from '../../Chart.types';

/** Selector prefix of each theme; `.dark` matches next-themes' class. */
export const CHART_THEMES: Record<ChartTheme, string> = {
    light: '',
    dark: '.dark',
};

// Config colors may come from an API, so anything that could close the
// declaration or the <style> tag is dropped rather than written out.
const SAFE_KEY = /^[\w-]+$/;
const UNSAFE_COLOR = /[<>{};]/;

const isSafeColor = (color: string | undefined): color is string =>
    !!color && !UNSAFE_COLOR.test(color);

/** `--color-<key>` declarations of a chart, once per theme. */
export function buildChartCss(id: string, config: ChartConfig) {
    const colored = Object.entries(config).filter(
        ([key, item]) => SAFE_KEY.test(key) && (item.theme ?? item.color),
    );
    if (!colored.length) return '';
    return Object.entries(CHART_THEMES)
        .map(([theme, prefix]) => {
            const vars = colored
                .map(([key, item]) => {
                    const color =
                        item.theme?.[theme as ChartTheme] ?? item.color;
                    return isSafeColor(color)
                        ? `  --color-${key}: ${color};`
                        : null;
                })
                .filter(Boolean)
                .join('\n');
            return `${prefix} [data-chart=${id}] {\n${vars}\n}`;
        })
        .join('\n');
}

/**
 * The config entry of a tooltip or legend item. `key` names a field whose
 * value may itself be a config key, e.g. `nameKey="browser"` on a pie.
 */
export function getPayloadConfig(
    config: ChartConfig,
    payload: unknown,
    key: string,
) {
    if (typeof payload !== 'object' || payload === null) return;
    const inner =
        'payload' in payload &&
        typeof payload.payload === 'object' &&
        payload.payload !== null
            ? (payload.payload as Record<string, unknown>)
            : undefined;
    const outer = payload as Record<string, unknown>;

    let configKey = key;
    if (typeof outer[key] === 'string') configKey = outer[key];
    else if (typeof inner?.[key] === 'string') configKey = inner[key];

    return configKey in config ? config[configKey] : config[key];
}

/** A tooltip value: numbers through `valueFormatter` or locale grouping. */
export function formatTooltipValue(
    value: unknown,
    name: string,
    valueFormatter?: (value: number, name: string) => ReactNode,
): ReactNode {
    if (value == null) return null;
    if (typeof value !== 'number') return String(value);
    return valueFormatter
        ? valueFormatter(value, name)
        : value.toLocaleString();
}
