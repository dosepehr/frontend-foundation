import type * as React from 'react'
import type { Progress as ProgressPrimitive } from 'radix-ui'
import type { VariantProps } from 'class-variance-authority'
import { progressVariants } from './components'

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
