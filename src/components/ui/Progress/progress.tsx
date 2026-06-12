'use client'

import * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/utils/funcs/cn'

const progressVariants = cva(
    'h-full w-full flex-1 transition-all duration-300 ease-in-out',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                success: 'bg-success',
                warning: 'bg-warning',
                destructive: 'bg-destructive',
                info: 'bg-info',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>

const trackVariants = cva('relative h-2 w-full overflow-hidden rounded-full', {
    variants: {
        variant: {
            default: 'bg-primary/20',
            success: 'bg-success/20',
            warning: 'bg-warning/20',
            destructive: 'bg-destructive/20',
            info: 'bg-info/20',
        },
    },
    defaultVariants: { variant: 'default' },
})

function Progress({ className, value, variant, ...props }: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot='progress'
            data-variant={variant}
            className={cn(trackVariants({ variant }), className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot='progress-indicator'
                className={cn(progressVariants({ variant }))}
                style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}

export { Progress }
export type { ProgressProps }
