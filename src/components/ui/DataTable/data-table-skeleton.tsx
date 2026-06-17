'use client'

import { motion } from 'motion/react'
import { Skeleton } from '../Skeleton/index'

interface DataTableSkeletonProps {
    columns?: number
    rows?: number
}

function DataTableSkeleton({ columns = 5, rows = 8 }: DataTableSkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className='w-full overflow-auto rounded-lg border border-border'
        >
            <table className='w-full caption-bottom text-sm'>
                <thead>
                    <tr className='border-b border-border bg-muted/50'>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className='h-10 px-3'>
                                <Skeleton className='h-4 w-24 mx-auto' />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, ri) => (
                        <tr key={ri} className='border-b border-border last:border-0'>
                            {Array.from({ length: columns }).map((_, ci) => (
                                <td key={ci} className='px-3 py-2.5'>
                                    <Skeleton className='h-4 w-full' />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}

export { DataTableSkeleton }
export type { DataTableSkeletonProps }
