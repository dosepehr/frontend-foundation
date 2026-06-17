'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableRoot } from './data-table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableSkeleton } from './data-table-skeleton';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    current: number;
    total: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;
    maxHeight?: number | string;
    className?: string;
    emptyTitle?: string;
    emptyDescription?: string;
}

function DataTable<TData>({
    columns,
    data,
    current,
    total,
    setPage,
    limit,
    setLimit,
    maxHeight,
    className,
    emptyTitle,
    emptyDescription,
}: DataTableProps<TData>) {
    const isEmpty = data.length === 0

    return (
        <div className='flex flex-col gap-3'>
            <DataTableRoot
                columns={columns}
                data={data}
                maxHeight={maxHeight}
                className={className}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
            />
            {!isEmpty && (
                <DataTablePagination
                    current={current}
                    total={total}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}
        </div>
    );
}

export { DataTable, DataTableSkeleton };
export { TableState } from './data-table-state';
export type { DataTableProps };
export type { TableStateProps } from './data-table-state';

