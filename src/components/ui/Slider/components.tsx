'use client'

import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/utils/funcs/cn'

const trackVariants = cva('relative h-1.5 w-full grow overflow-hidden rounded-full', {
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

const rangeVariants = cva('absolute h-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            success: 'bg-success',
            warning: 'bg-warning',
            destructive: 'bg-destructive',
            info: 'bg-info',
        },
    },
    defaultVariants: { variant: 'default' },
})

const thumbVariants = cva(
    'block size-4 rounded-full border-2 bg-background shadow-sm transition-[color,box-shadow] outline-none data-[disabled]:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'border-primary focus-visible:ring-3 focus-visible:ring-primary/50',
                success: 'border-success focus-visible:ring-3 focus-visible:ring-success/50',
                warning: 'border-warning focus-visible:ring-3 focus-visible:ring-warning/50',
                destructive: 'border-destructive focus-visible:ring-3 focus-visible:ring-destructive/50',
                info: 'border-info focus-visible:ring-3 focus-visible:ring-info/50',
            },
        },
        defaultVariants: { variant: 'default' },
    }
)

function Slider({ className, variant, defaultValue, ...props }: React.ComponentProps<typeof SliderPrimitive.Root> & VariantProps<typeof rangeVariants>) {
    const thumbCount = (defaultValue ?? props.value ?? [0]).length

    return (
        <SliderPrimitive.Root
            data-slot='slider'
            data-variant={variant}
            defaultValue={defaultValue}
            className={cn(
                'relative flex w-full touch-none items-center select-none',
                'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot='slider-track'
                className={trackVariants({ variant })}
            >
                <SliderPrimitive.Range
                    data-slot='slider-range'
                    className={rangeVariants({ variant })}
                />
            </SliderPrimitive.Track>
            {Array.from({ length: thumbCount }).map((_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    data-slot='slider-thumb'
                    className={thumbVariants({ variant })}
                />
            ))}
        </SliderPrimitive.Root>
    )
}

export { Slider }
