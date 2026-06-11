'use client'

import { cn } from '@/src/utils/funcs/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='skeleton'
            className={cn(
                'rounded-md bg-muted relative overflow-hidden',
                'before:absolute before:inset-0',
                'before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent',
                'before:animate-[shimmer_1.5s_infinite]',
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
