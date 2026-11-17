'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Wraps `callback` so it runs `delay` ms after the last call. `flush` runs a
 * pending call right away and `cancel` drops it. Pending calls are dropped
 * on unmount.
 */
export function useDebouncedCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    delay: number,
) {
    const callbackRef = useRef(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingArgsRef = useRef<Args | null>(null);

    useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    const cancel = useCallback(() => {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = null;
        pendingArgsRef.current = null;
    }, []);

    const flush = useCallback(() => {
        const args = pendingArgsRef.current;
        cancel();
        if (args) callbackRef.current(...args);
    }, [cancel]);

    const run = useCallback(
        (...args: Args) => {
            cancel();
            pendingArgsRef.current = args;
            timerRef.current = setTimeout(flush, delay);
        },
        [cancel, flush, delay],
    );

    useEffect(() => cancel, [cancel]);

    return { run, flush, cancel };
}
