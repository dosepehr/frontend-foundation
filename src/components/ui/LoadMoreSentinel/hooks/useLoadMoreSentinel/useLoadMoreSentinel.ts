'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

export type UseLoadMoreSentinelOptions = {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onFetchNextPage?: () => void;
};

/**
 * Returns a ref for an element at the end of a scrolling list; when it scrolls
 * into view and there is another page, `onFetchNextPage` is called. The
 * observer is recreated after each fetch, so a sentinel still in view keeps
 * loading until the list fills its container.
 */
export function useLoadMoreSentinel({
    hasNextPage = false,
    isFetchingNextPage = false,
    onFetchNextPage,
}: UseLoadMoreSentinelOptions) {
    const fetchRef = useRef(onFetchNextPage);
    useLayoutEffect(() => {
        fetchRef.current = onFetchNextPage;
    });

    return useCallback(
        (node: HTMLElement | null) => {
            if (!node || !hasNextPage || isFetchingNextPage) return;
            if (typeof IntersectionObserver === 'undefined') return;
            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    fetchRef.current?.();
                }
            });
            observer.observe(node);
            return () => observer.disconnect();
        },
        [hasNextPage, isFetchingNextPage],
    );
}
