/* c8 ignore start */
'use client';
/* c8 ignore stop */

type PieSliceLabelProps = {
    x?: number;
    y?: number;
    textAnchor?: string;
    percent?: number;
    format: (share: number) => string;
};

const ANCHORS = new Set(['start', 'middle', 'end']);

/** A slice's share beside it, in text ink rather than the slice color. */
const PieSliceLabel = ({
    x,
    y,
    textAnchor,
    percent,
    format,
}: PieSliceLabelProps) => (
    <text
        x={x}
        y={y}
        textAnchor={
            ANCHORS.has(textAnchor ?? '')
                ? (textAnchor as 'start' | 'middle' | 'end')
                : 'middle'
        }
        dominantBaseline="central"
        data-slot="slice-label"
        className="fill-foreground text-xs tabular-nums"
    >
        {format(percent ?? 0)}
    </text>
);

export { PieSliceLabel };
