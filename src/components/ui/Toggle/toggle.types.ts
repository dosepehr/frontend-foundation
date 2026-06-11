import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { Toggle as TogglePrimitive } from 'radix-ui'
import type { toggleVariants } from './components'

export type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
