/** Corner radii [top-left, top-right, bottom-right, bottom-left] in px. */
export type BarRadius = [number, number, number, number];

const RADIUS = 4;

/**
 * Rounds the data end of a bar and keeps it square at the baseline: the
 * top of a column, or the far end of a bar (its left side in RTL).
 */
export function getBarRadius(horizontal: boolean, rtl: boolean): BarRadius {
    if (!horizontal) return [RADIUS, RADIUS, 0, 0];
    return rtl ? [RADIUS, 0, 0, RADIUS] : [0, RADIUS, RADIUS, 0];
}
