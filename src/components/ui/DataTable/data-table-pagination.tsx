'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../Pagination/pagination'
import { SelectWrapper } from '../Select/select'

const PAGE_SIZE_OPTIONS = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
]

const MAX_PAGES = 5

interface DataTablePaginationProps {
    current: number
    total: number
    setPage: (page: number) => void
    limit: number
    setLimit: (limit: number) => void
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= MAX_PAGES) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = [1]

    if (current > 3) pages.push('ellipsis')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('ellipsis')

    pages.push(total)
    return pages
}

function DataTablePagination({
    current,
    total,
    setPage,
    limit,
    setLimit,
}: DataTablePaginationProps) {
    const pages = getPageNumbers(current, total)

    return (
        <div className='flex items-center justify-between gap-4 px-1'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span className='whitespace-nowrap'>Rows per page</span>
                <SelectWrapper
                    value={String(limit)}
                    onValueChange={(v) => {
                        setLimit(Number(v))
                        setPage(1)
                    }}
                    options={PAGE_SIZE_OPTIONS}
                    triggerClassName='h-8 w-20'
                />
            </div>

            <Pagination className='w-auto mx-0'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => { e.preventDefault(); if (current > 1) setPage(current - 1) }}
                            aria-disabled={current <= 1}
                            className={current <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>

                    {pages.map((page, i) =>
                        page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === current}
                                    onClick={(e) => { e.preventDefault(); setPage(page) }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => { e.preventDefault(); if (current < total) setPage(current + 1) }}
                            aria-disabled={current >= total}
                            className={current >= total ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export { DataTablePagination }
export type { DataTablePaginationProps }
