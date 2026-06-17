'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircleIcon, InboxIcon, SearchXIcon } from 'lucide-react'
import EmptyWrapper from '../Empty'
import { Button } from '../Button/components'

interface TableStateProps {
    isLoading: boolean
    isFetching?: boolean
    isError?: boolean
    isEmpty?: boolean
    loadingEl?: React.ReactNode
    onRetry?: () => void
    emptyTitle?: string
    emptyDescription?: string
    hasSearch?: boolean
    children: React.ReactNode
}

const fadeProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
}

function TableState({
    isLoading,
    isFetching = false,
    isError = false,
    isEmpty = false,
    loadingEl,
    onRetry,
    emptyTitle,
    emptyDescription,
    hasSearch = false,
    children,
}: TableStateProps) {
    const showLoading = isLoading || isFetching
    const showChildren = !showLoading && !isError && !isEmpty

    return (
        <AnimatePresence mode='wait'>
            {showLoading && (
                <motion.div key='loading' {...fadeProps}>
                    {loadingEl}
                </motion.div>
            )}

            {!showLoading && isError && (
                <motion.div key='error' {...fadeProps}>
                    <EmptyWrapper
                        title='Something went wrong'
                        description='Failed to load data. Please try again.'
                        icon={<AlertCircleIcon />}
                        className='min-h-72'
                        action={
                            onRetry && (
                                <Button variant='outline' size='sm' onClick={onRetry}>
                                    Retry
                                </Button>
                            )
                        }
                    />
                </motion.div>
            )}

            {!showLoading && !isError && isEmpty && (
                <motion.div key='empty' {...fadeProps}>
                    <EmptyWrapper
                        title={emptyTitle ?? (hasSearch ? 'No results found' : 'No data yet')}
                        description={
                            emptyDescription ??
                            (hasSearch ? 'Try adjusting your search or filters.' : undefined)
                        }
                        icon={hasSearch ? <SearchXIcon /> : <InboxIcon />}
                        className='min-h-72'
                    />
                </motion.div>
            )}

            {showChildren && (
                <motion.div key='content' {...fadeProps}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { TableState }
export type { TableStateProps }
