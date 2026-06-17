'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type RowSelectionState,
    type SortingState,
} from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/src/utils/funcs/cn'
import {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from './table'
import EmptyWrapper from '../Empty'
import { InboxIcon } from 'lucide-react'
import { InputWrapper } from '../Input'
import { Button } from '../Button/components'
import { Checkbox } from '../Checkbox'

const fadeProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
}

interface DataTableRootProps<TData> {
    columns: ColumnDef<TData, unknown>[]
    data: TData[]
    maxHeight?: number | string
    stickyOffset?: number
    className?: string
    emptyTitle?: string
    emptyDescription?: string
    rowSelection?: RowSelectionState
    setRowSelection?: (value: RowSelectionState) => void
    haveSelection?: boolean
    filterColumn?: string
    filterPlaceholder?: string
    footerRow?: React.ReactNode[]
    hideRowIndex?: boolean
    current?: number
    limit?: number
}

function selectionColumn<TData>(): ColumnDef<TData, unknown> {
    return {
        id: '__select__',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                          ? 'indeterminate'
                          : false
                }
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
    }
}

function indexColumn<TData>(current = 1, limit = 20): ColumnDef<TData, unknown> {
    return {
        id: '__index__',
        header: '#',
        cell: ({ row }) => (
            <span className='tabular-nums text-muted-foreground'>
                {(current - 1) * limit + row.index + 1}
            </span>
        ),
        enableSorting: false,
    }
}

function DataTableRoot<TData>({
    columns,
    data,
    maxHeight,
    stickyOffset,
    className,
    emptyTitle = 'No results',
    emptyDescription,
    rowSelection: externalRowSelection,
    setRowSelection: externalSetRowSelection,
    haveSelection = false,
    filterColumn,
    filterPlaceholder = 'Search...',
    footerRow,
    hideRowIndex = false,
    current = 1,
    limit = 20,
}: DataTableRootProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({})

    const rowSelection = externalRowSelection ?? internalRowSelection
    const setRowSelection = externalSetRowSelection ?? setInternalRowSelection

    const resolvedColumns = React.useMemo(() => {
        const cols: ColumnDef<TData, unknown>[] = []
        if (haveSelection) cols.push(selectionColumn<TData>())
        if (!hideRowIndex) cols.push(indexColumn<TData>(current, limit))
        cols.push(...columns)
        return cols
    }, [columns, haveSelection, hideRowIndex, current, limit])

    const table = useReactTable({
        data,
        columns: resolvedColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: (updater) => {
            const next = typeof updater === 'function' ? updater(rowSelection) : updater
            setRowSelection(next)
        },
        state: { sorting, columnFilters, rowSelection },
        enableSorting: false,
    })

    const isEmpty = table.getRowModel().rows.length === 0

    const resolvedMaxHeight = stickyOffset !== undefined
        ? `calc(100dvh - ${stickyOffset}px)`
        : maxHeight

    return (
        <motion.div {...fadeProps} className={cn('flex flex-col gap-2', className)}>
            {filterColumn && (
                <div className='px-1'>
                    <InputWrapper
                        startAddon={<SearchIcon />}
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
                        className='max-w-sm'
                    />
                </div>
            )}

            <div
                style={resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : undefined}
                className={cn(
                    'w-full rounded-lg border border-border',
                    resolvedMaxHeight ? 'overflow-auto' : 'overflow-x-auto',
                )}
            >
                <table className='w-full caption-bottom text-sm'>
                    {!isEmpty && (
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, i) => {
                                        const isFirst = i === 0
                                        const canSort = header.column.getCanSort()
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    'text-muted-foreground font-medium text-xs',
                                                    isFirst ? 'text-start' : 'text-center',
                                                    resolvedMaxHeight && 'sticky top-0 z-10 bg-muted',
                                                )}
                                            >
                                                {header.isPlaceholder ? null : canSort ? (
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        className='-mx-2 gap-1'
                                                        onClick={() => header.column.toggleSorting()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ArrowUpIcon className='size-3' />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ArrowDownIcon className='size-3' />
                                                        ) : (
                                                            <ArrowUpDownIcon className='size-3' />
                                                        )}
                                                    </Button>
                                                ) : (
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                    )}
                    <TableBody>
                        <AnimatePresence mode='wait'>
                            {isEmpty ? (
                                <motion.tr key='empty' {...fadeProps}>
                                    <td colSpan={resolvedColumns.length} className='p-0'>
                                        <EmptyWrapper
                                            title={emptyTitle}
                                            description={emptyDescription}
                                            icon={<InboxIcon />}
                                            className='min-h-72 rounded-none border-0'
                                        />
                                    </td>
                                </motion.tr>
                            ) : (
                                <motion.tr key='rows' {...fadeProps} className='contents'>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() ? 'selected' : undefined}
                                        >
                                            {row.getVisibleCells().map((cell, i) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn(i === 0 ? 'text-start' : 'text-center')}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </TableBody>
                    {footerRow && !isEmpty && (
                        <TableFooter>
                            <TableRow>
                                {footerRow.map((cell, i) => (
                                    <TableCell key={i}>{cell}</TableCell>
                                ))}
                            </TableRow>
                        </TableFooter>
                    )}
                </table>
            </div>
        </motion.div>
    )
}

export { DataTableRoot }
export type { DataTableRootProps }
