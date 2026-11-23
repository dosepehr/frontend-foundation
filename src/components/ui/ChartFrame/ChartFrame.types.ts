import type { ChartLocale } from '@/utils/funcs/charts';
import type { ReactNode } from 'react';

export type ChartLabels = {
    /** Screen-reader text of the loading skeleton. */
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
    errorTitle: string;
    errorDescription: string;
    retry: string;
};

/** Loading, empty and error props every chart takes. */
export type ChartStateProps = {
    /** First load, before any data: shows a skeleton shaped like the chart. */
    isLoading?: boolean;
    /** Refetch with data on screen: keeps the chart, dimmed. */
    isFetching?: boolean;
    /** Any truthy value shows the error state instead of the chart. */
    error?: unknown;
    /** Adds a retry button to the error state. */
    onRetry?: () => void;
    /** Replaces the built-in empty state. */
    emptyState?: ReactNode;
    /** Replaces the built-in error state. */
    errorState?: ReactNode;
    /** Copy of the built-in states and digits of numbers. */
    locale?: ChartLocale;
    labels?: Partial<ChartLabels>;
};

export type ChartSkeletonVariant =
    | 'cartesian'
    | 'bar'
    | 'pie'
    | 'radial'
    | 'radar';

export type ChartTableColumn = {
    key: string;
    label: ReactNode;
    format?: (value: unknown) => ReactNode;
};

export type ChartTable = {
    columns: ChartTableColumn[];
    rows: readonly object[];
};

export type ChartFrameProps = ChartStateProps & {
    isEmpty: boolean;
    /** Plot height in px, axis band included. */
    height: number;
    skeleton?: ChartSkeletonVariant;
    /** Names the chart for screen readers and captions the table. */
    label?: string;
    /** The data as a table: screen-reader only unless `showTable`. */
    table?: ChartTable;
    showTable?: boolean;
    className?: string;
    children: ReactNode;
};

export type ChartFrameState = 'loading' | 'error' | 'empty' | 'ready';
