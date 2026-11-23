/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import type { ChartFrameProps, ChartLabels } from './ChartFrame.types';
import {
    ChartDataTable,
    ChartEmptyState,
    ChartErrorState,
    ChartSkeleton,
} from './components';
import { getChartFrameState } from './utils/chartFrameState/chartFrameState';

const LABELS: Record<'en' | 'fa', ChartLabels> = {
    en: {
        loading: 'Loading chart',
        emptyTitle: 'No data yet',
        emptyDescription: 'There is nothing to show for this range.',
        errorTitle: "Couldn't load the chart",
        errorDescription: 'Check your connection and try again.',
        retry: 'Try again',
    },
    fa: {
        loading: 'در حال بارگذاری نمودار',
        emptyTitle: 'داده‌ای وجود ندارد',
        emptyDescription: 'برای این بازه چیزی برای نمایش نیست.',
        errorTitle: 'بارگذاری نمودار ناموفق بود',
        errorDescription: 'اتصال خود را بررسی کنید و دوباره تلاش کنید.',
        retry: 'تلاش دوباره',
    },
};

/**
 * The box around every chart: a fixed height, the loading, empty and error
 * states, a dimmed chart while refetching, and the data as a table.
 */
const ChartFrame = ({
    isLoading,
    isFetching,
    error,
    onRetry,
    emptyState,
    errorState,
    locale = 'en',
    labels: custom,
    isEmpty,
    height,
    skeleton = 'cartesian',
    label,
    table,
    showTable = false,
    className,
    children,
}: ChartFrameProps) => {
    const labels = { ...LABELS[locale], ...custom };
    const state = getChartFrameState({ isLoading, error, isEmpty });

    return (
        <figure
            data-slot="chart-frame"
            data-state={state}
            aria-label={label}
            aria-busy={isLoading || isFetching || undefined}
            className={cn('m-0 w-full', className)}
        >
            <div
                className={cn(
                    'relative w-full transition-opacity duration-200',
                    isFetching && state === 'ready' && 'opacity-60',
                )}
                style={{ height }}
            >
                {state === 'loading' && (
                    <ChartSkeleton variant={skeleton} label={labels.loading} />
                )}
                {state === 'error' &&
                    (errorState ?? (
                        <ChartErrorState labels={labels} onRetry={onRetry} />
                    ))}
                {state === 'empty' &&
                    (emptyState ?? <ChartEmptyState labels={labels} />)}
                {state === 'ready' && children}
            </div>
            {state === 'ready' && table && (
                <ChartDataTable
                    table={table}
                    caption={label}
                    visible={showTable}
                />
            )}
        </figure>
    );
};

export default ChartFrame;
