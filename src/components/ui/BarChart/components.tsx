/* c8 ignore start */
'use client';
/* c8 ignore stop */

type BarValueLabelProps = {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    value?: unknown;
    horizontal: boolean;
    rtl: boolean;
    format: (value: number) => string;
};

const GAP = 6;

/**
 * A value just past the bar end, on one line. Recharts' own label wraps
 * to the bar width, which breaks "1,284 users" over two lines.
 */
const BarValueLabel = ({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    value,
    horizontal,
    rtl,
    format,
}: BarValueLabelProps) => {
    if (typeof value !== 'number') return null;
    const [left, top, w, h] = [x, y, width, height].map(Number);
    const position = horizontal
        ? {
              x: rtl ? left - GAP : left + w + GAP,
              y: top + h / 2,
              textAnchor: rtl ? ('end' as const) : ('start' as const),
              dominantBaseline: 'central' as const,
          }
        : { x: left + w / 2, y: top - GAP, textAnchor: 'middle' as const };

    return (
        <text
            {...position}
            data-slot="bar-value"
            className="fill-foreground text-xs tabular-nums"
        >
            {format(value)}
        </text>
    );
};

export { BarValueLabel };
