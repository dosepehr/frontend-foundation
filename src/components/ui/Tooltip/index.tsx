'use client'

import type { FC } from 'react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components'
import type { TooltipWrapperProps } from './tooltip.types'

const TooltipWrapper: FC<TooltipWrapperProps> = ({
    content,
    children,
    side = 'top',
    sideOffset = 4,
    delayDuration = 0,
    open,
    defaultOpen,
    onOpenChange,
    contentClassName,
    variant,
}) => {
    return (
        <TooltipProvider delayDuration={delayDuration}>
            <Tooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} sideOffset={sideOffset} variant={variant} className={contentClassName}>
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipWrapper

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components'
export type { TooltipWrapperProps } from './tooltip.types'
