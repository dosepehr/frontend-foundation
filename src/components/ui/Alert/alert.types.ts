import type { ComponentType, ReactNode } from 'react'
import type { alertVariants } from './components'
import type { VariantProps } from 'class-variance-authority'

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

export type AlertWrapperProps = {
    title?: ReactNode
    children: ReactNode
    variant?: AlertVariant
    Icon?: ComponentType<{ size?: number; className?: string }>
}
