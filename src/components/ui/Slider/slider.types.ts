import type * as React from 'react'
import type { Slider as SliderPrimitive } from 'radix-ui'
import type { VariantProps } from 'class-variance-authority'
import type { rangeVariants } from './components'

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> &
    VariantProps<typeof rangeVariants>
