'use client'

import * as React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './sheet'
import Button from '../Button'

export interface SheetWrapperProps {
    trigger?: React.ReactNode
    title?: string
    description?: string
    children?: React.ReactNode
    footer?: React.ReactNode
    side?: 'top' | 'right' | 'bottom' | 'left'
    open?: boolean
    onOpenChange?: (open: boolean) => void
    showCloseButton?: boolean
    contentClassName?: string
}

export function SheetWrapper({
    trigger,
    title,
    description,
    children,
    footer,
    side = 'right',
    open,
    onOpenChange,
    showCloseButton = true,
    contentClassName,
}: SheetWrapperProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent
                side={side}
                showCloseButton={showCloseButton}
                className={contentClassName}
            >
                {(title || description) && (
                    <SheetHeader>
                        {title && <SheetTitle>{title}</SheetTitle>}
                        {description && (
                            <SheetDescription>{description}</SheetDescription>
                        )}
                    </SheetHeader>
                )}
                {children && (
                    <div className='flex-1 overflow-y-auto px-4'>{children}</div>
                )}
                {footer && (
                    <SheetFooter>
                        {footer}
                        <SheetClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
