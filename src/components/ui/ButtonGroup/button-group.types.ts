import type { ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonGroupVariants } from './components'
import type { ButtonWrapperProps } from '../Button'

export type ButtonGroupItemDef = ButtonWrapperProps & {
    key?: string
}

export type ButtonGroupWrapperProps = VariantProps<typeof buttonGroupVariants> & {
    items: ButtonGroupItemDef[]
    separator?: boolean
    className?: string
    children?: ReactNode
}
