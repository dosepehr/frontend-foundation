/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Button from '@/components/ui/Button';
import Empty from '@/components/ui/Empty';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/utils/funcs/cn';
import {
    ChartColumnIcon,
    RotateCcwIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import type {
    ChartLabels,
    ChartSkeletonVariant,
    ChartTable,
} from './ChartFrame.types';

// Column heights of the bar skeleton, in percent of the plot.
const BAR_HEIGHTS = [45, 70, 55, 85, 40, 65, 90, 50];

/** A placeholder shaped like the chart, so the layout doesn't jump. */
const ChartSkeleton = ({
    variant,
    label,
}: {
    variant: ChartSkeletonVariant;
    label: string;
}) => (
    <div
        role="status"
        data-slot="chart-skeleton"
        data-variant={variant}
        className="flex size-full items-end justify-center gap-3 p-4"
    >
        <span className="sr-only">{label}</span>
        {variant === 'bar' &&
            BAR_HEIGHTS.map((height, index) => (
                <Skeleton
                    key={index}
                    className="w-6 rounded-b-none"
                    style={{ height: `${height}%` }}
                />
            ))}
        {variant === 'cartesian' && (
            <Skeleton className="h-3/4 w-full rounded-none [clip-path:polygon(0_70%,15%_45%,30%_55%,45%_25%,60%_40%,75%_15%,90%_30%,100%_20%,100%_100%,0_100%)]" />
        )}
        {variant === 'radar' && (
            <Skeleton className="aspect-square h-4/5 self-center rounded-none [clip-path:polygon(50%_0,100%_38%,81%_100%,19%_100%,0_38%)]" />
        )}
        {(variant === 'pie' || variant === 'radial') && (
            <Skeleton
                className={cn(
                    'aspect-square h-4/5 self-center rounded-full',
                    variant === 'radial'
                        ? 'mask-[radial-gradient(circle,transparent_55%,black_56%)]'
                        : 'mask-[radial-gradient(circle,transparent_35%,black_36%)]',
                )}
            />
        )}
    </div>
);

const ChartEmptyState = ({ labels }: { labels: ChartLabels }) => (
    <Empty
        icon={<ChartColumnIcon />}
        title={labels.emptyTitle}
        description={labels.emptyDescription}
        className="size-full border-0 p-4"
    />
);

const ChartErrorState = ({
    labels,
    onRetry,
}: {
    labels: ChartLabels;
    onRetry?: () => void;
}) => (
    <div role="alert" className="size-full">
        <Empty
            icon={<TriangleAlertIcon className="text-destructive" />}
            title={labels.errorTitle}
            description={labels.errorDescription}
            className="size-full border-0 p-4"
            action={
                onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        <RotateCcwIcon />
                        {labels.retry}
                    </Button>
                )
            }
        />
    </div>
);

/** The chart's data as a table: the text twin of what the marks show. */
const ChartDataTable = ({
    table,
    caption,
    visible,
}: {
    table: ChartTable;
    caption?: string;
    visible: boolean;
}) => (
    <table
        data-slot="chart-table"
        className={cn(visible ? 'mt-4 w-full text-sm' : 'sr-only')}
    >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
            <tr className="border-b">
                {table.columns.map((column) => (
                    <th
                        key={column.key}
                        scope="col"
                        className="px-2 py-1.5 text-start font-medium text-muted-foreground"
                    >
                        {column.label}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {table.rows.map((row, index) => (
                <tr key={index} className="border-b last:border-0">
                    {table.columns.map((column, columnIndex) => {
                        const value = (row as Record<string, unknown>)[
                            column.key
                        ];
                        const Cell = columnIndex === 0 ? 'th' : 'td';
                        return (
                            <Cell
                                key={column.key}
                                scope={columnIndex === 0 ? 'row' : undefined}
                                className="px-2 py-1.5 text-start font-normal tabular-nums"
                            >
                                {column.format
                                    ? column.format(value)
                                    : String(value ?? '')}
                            </Cell>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    </table>
);

export { ChartDataTable, ChartEmptyState, ChartErrorState, ChartSkeleton };
