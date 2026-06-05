'use client'

import type { FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from './components'
import type { CardWrapperProps } from './card.types'

const CardWrapper: FC<CardWrapperProps> = ({
    title,
    description,
    action,
    children,
    footer,
    size,
    className,
    headerProps,
    contentProps,
    footerProps,
}) => {
    return (
        <Card size={size} className={className}>
            {(title || description || action) && (
                <CardHeader {...headerProps}>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                    {action && <CardAction>{action}</CardAction>}
                </CardHeader>
            )}
            {children && <CardContent {...contentProps}>{children}</CardContent>}
            {footer && <CardFooter {...footerProps}>{footer}</CardFooter>}
        </Card>
    )
}

export default CardWrapper
