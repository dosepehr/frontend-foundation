import type { ComponentProps, ReactNode } from 'react'

export type CardProps = ComponentProps<'div'> & {
    size?: 'default' | 'sm'
}

export type CardHeaderProps = ComponentProps<'div'>
export type CardTitleProps = ComponentProps<'div'>
export type CardDescriptionProps = ComponentProps<'div'>
export type CardActionProps = ComponentProps<'div'>
export type CardContentProps = ComponentProps<'div'>
export type CardFooterProps = ComponentProps<'div'>

export type CardWrapperProps = {
    title?: ReactNode
    description?: ReactNode
    action?: ReactNode
    children?: ReactNode
    footer?: ReactNode
    size?: 'default' | 'sm'
    className?: string
    headerProps?: CardHeaderProps
    contentProps?: CardContentProps
    footerProps?: CardFooterProps
}
