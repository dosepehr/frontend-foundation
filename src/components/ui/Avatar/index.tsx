'use client'

import type { FC } from 'react'
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from './components'
import type { AvatarWrapperProps } from './avatar.types'

const AvatarWrapper: FC<AvatarWrapperProps> = ({
    src,
    alt,
    fallback,
    badge,
    badgeClassName,
    size = 'default',
    className,
    imageProps,
    fallbackProps,
}) => {
    return (
        <Avatar size={size} className={className}>
            {src && <AvatarImage src={src} alt={alt} {...imageProps} />}
            <AvatarFallback {...fallbackProps}>{fallback}</AvatarFallback>
            {badge && (
                <AvatarBadge className={badgeClassName}>{badge}</AvatarBadge>
            )}
        </Avatar>
    )
}

export default AvatarWrapper

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from './components'
export type { AvatarWrapperProps } from './avatar.types'
