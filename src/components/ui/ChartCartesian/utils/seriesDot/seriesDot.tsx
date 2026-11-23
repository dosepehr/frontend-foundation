export type SeriesDots = 'none' | 'end' | 'all';

type DotRenderProps = { cx?: number; cy?: number; index?: number };

// Markers are >= 8px with a 2px surface ring, so they read on any line.
const RING = { stroke: 'var(--chart-surface)', strokeWidth: 2 } as const;

/** The `dot` prop of a Line or Area: none, only the last point, or all. */
export function seriesDot(mode: SeriesDots, color: string, lastIndex: number) {
    if (mode === 'none') return false;
    if (mode === 'all') return { r: 4, fill: color, ...RING };
    return function SeriesEndDot({ cx, cy, index }: DotRenderProps) {
        return index === lastIndex && cx != null && cy != null ? (
            <circle
                key={index}
                data-slot="series-end-dot"
                cx={cx}
                cy={cy}
                r={4}
                fill={color}
                {...RING}
            />
        ) : (
            <g key={index} />
        );
    };
}

/** The hovered point: a step larger than the resting marker. */
export const ACTIVE_DOT = { r: 5, ...RING } as const;
