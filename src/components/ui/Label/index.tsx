'use client'

import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '@/src/utils/funcs/cn'
import Asteriks from '../Asteriks'
import type { LabelProps } from './label.types'

function Label({ className, disabled, required, children, ...props }: LabelProps) {
    return (
        <LabelPrimitive.Root
            data-slot='label'
            className={cn(
                'flex items-center gap-2 text-xs xs:text-sm leading-none font-medium select-none relative w-fit',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
            {required && <Asteriks />}
        </LabelPrimitive.Root>
    )
}

export { Label }
export type { LabelProps } from './label.types'
