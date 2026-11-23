'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Series hidden from a chart through its legend. The last visible series
 * can't be hidden, so the chart never turns into an empty frame.
 */
export function useSeriesVisibility(keys: string[], initialHidden?: string[]) {
    const [hidden, setHidden] = useState<ReadonlySet<string>>(
        () => new Set(initialHidden),
    );

    const toggle = useCallback(
        (key: string) =>
            setHidden((current) => {
                const next = new Set(current);
                if (next.has(key)) next.delete(key);
                else if (keys.some((k) => k !== key && !next.has(k)))
                    next.add(key);
                return next;
            }),
        [keys],
    );

    const visibleKeys = useMemo(
        () => keys.filter((key) => !hidden.has(key)),
        [keys, hidden],
    );

    return { hidden, visibleKeys, toggle };
}
