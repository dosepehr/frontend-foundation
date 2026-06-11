import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import type { toggleVariants } from '../Toggle/components'
import type { ToggleGroupItem } from './components'

export type ToggleGroupItemDef = ComponentProps<typeof ToggleGroupItem> & {
    label?: ReactNode
}

export type ToggleGroupWrapperProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
        items: ToggleGroupItemDef[]
        spacing?: number
        orientation?: 'horizontal' | 'vertical'
    }
