'use client';

import { useCallback, useEffect, useState } from 'react';

// Ticks faster than once a second so the shown second flips on time.
const TICK_MS = 250;

/**
 * Seconds left until a deadline set `seconds` from mount or the last
 * `restart`. Counts against the clock, so throttled tabs don't drift.
 */
export function useCountdown(seconds: number) {
    const [deadline, setDeadline] = useState(() => Date.now() + seconds * 1000);
    const [now, setNow] = useState(() => Date.now());
    const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
    const isDone = remaining === 0;

    useEffect(() => {
        if (isDone) return;
        const id = setInterval(() => setNow(Date.now()), TICK_MS);
        return () => clearInterval(id);
    }, [deadline, isDone]);

    const restart = useCallback(() => {
        const start = Date.now();
        setNow(start);
        setDeadline(start + seconds * 1000);
    }, [seconds]);

    return { remaining, isDone, restart };
}
