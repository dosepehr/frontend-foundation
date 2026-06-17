import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'

export interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[]
    data: TData[]

    // Pagination
    current: number
    total: number
    setPage: (page: number) => void
    limit: number
    setLimit: (limit: number) => void
    hidePagination?: boolean

    // Layout
    maxHeight?: number | string
    stickyOffset?: number
    className?: string

    // Empty state
    emptyTitle?: string
    emptyDescription?: string

    // Row selection
    rowSelection?: RowSelectionState
    setRowSelection?: (value: RowSelectionState) => void
    haveSelection?: boolean

    // Filter
    filterColumn?: string
    filterPlaceholder?: string

    // Footer
    footerRow?: React.ReactNode[]

    // Index column
    hideRowIndex?: boolean

    // Total items (for index column calculation)
    totalItems?: number
}
