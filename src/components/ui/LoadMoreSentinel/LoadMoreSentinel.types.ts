import type { UseLoadMoreSentinelOptions } from './hooks/useLoadMoreSentinel/useLoadMoreSentinel';

/** Options loaded from a server: search there and load pages on scroll. */
export type ServerOptionsProps = UseLoadMoreSentinelOptions & {
    /**
     * Called on every keystroke in the search box (debounce it yourself);
     * when given, the options are not filtered on the client.
     */
    onSearchChange?: (search: string) => void;
    /** Shown at the end of the list while the next page loads. */
    loadingMoreText?: string;
};

export type LoadMoreSentinelProps = UseLoadMoreSentinelOptions & {
    /** Shown while the next page loads. */
    loadingText?: string;
    className?: string;
};
