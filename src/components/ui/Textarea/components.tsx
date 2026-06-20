/* c8 ignore start */
'use client'
/* c8 ignore stop */

import { cn } from '@/src/utils/funcs/cn'
import type { ComponentProps } from 'react'

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot='textarea'
            className={cn(
                'text-foreground placeholder:text-muted-foreground placeholder:text-sm flex field-sizing-content min-h-18 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow,border] outline-none disabled:cursor-not-allowed disabled:opacity-50',
                'border-input/50 hover:enabled:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50',
                'aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-destructive/50',
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
