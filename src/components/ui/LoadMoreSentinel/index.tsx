/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Spinner from '@/components/ui/Spinner';
import { cn } from '@/utils/funcs/cn';
import type { LoadMoreSentinelProps } from './LoadMoreSentinel.types';
import { useLoadMoreSentinel } from './hooks/useLoadMoreSentinel/useLoadMoreSentinel';

/**
 * Put at the end of a scrolling list: loads the next page when it scrolls
 * into view and shows a spinner while that page loads.
 */
const LoadMoreSentinel = ({
    hasNextPage = false,
    isFetchingNextPage = false,
    onFetchNextPage,
    loadingText = 'Loading more...',
    className,
}: LoadMoreSentinelProps) => {
    const sentinelRef = useLoadMoreSentinel({
        hasNextPage,
        isFetchingNextPage,
        onFetchNextPage,
    });

    if (!hasNextPage && !isFetchingNextPage) return null;

    return (
        <div
            ref={sentinelRef}
            data-slot="load-more-sentinel"
            aria-live="polite"
            className={cn(
                'flex min-h-8 items-center justify-center gap-2 py-1.5 text-xs text-muted-foreground',
                className,
            )}
        >
            {isFetchingNextPage && (
                <>
                    <Spinner size="sm" aria-hidden />
                    {loadingText}
                </>
            )}
        </div>
    );
};

export default LoadMoreSentinel;
