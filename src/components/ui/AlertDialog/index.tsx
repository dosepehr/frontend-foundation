'use client'

import type { FC } from 'react'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from './components'
import type { AlertDialogWrapperProps, AlertDialogIntent } from './alert-dialog.types'

const intentConfig: Record<AlertDialogIntent, { mediaClassName: string; actionVariant: 'default' | 'destructive' | 'success' | 'warning' | 'info' }> = {
    default:     { mediaClassName: 'bg-muted text-foreground', actionVariant: 'default' },
    destructive: { mediaClassName: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive', actionVariant: 'destructive' },
    warning:     { mediaClassName: 'bg-warning/10 text-warning-foreground dark:bg-warning/20', actionVariant: 'warning' },
    info:        { mediaClassName: 'bg-info/10 text-info-foreground dark:bg-info/20', actionVariant: 'info' },
    success:     { mediaClassName: 'bg-success/10 text-success-foreground dark:bg-success/20', actionVariant: 'success' },
}

const AlertDialogWrapper: FC<AlertDialogWrapperProps> = ({
    trigger,
    title,
    description,
    media,
    mediaClassName,
    intent = 'default',
    confirmLabel = 'Continue',
    cancelLabel = 'Cancel',
    size = 'default',
    actionProps,
    cancelProps,
    contentProps,
}) => {
    const config = intentConfig[intent]

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent size={size} {...contentProps}>
                <AlertDialogHeader>
                    {media && (
                        <AlertDialogMedia className={mediaClassName ?? config.mediaClassName}>
                            {media}
                        </AlertDialogMedia>
                    )}
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel {...cancelProps}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction variant={config.actionVariant} {...actionProps}>
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDialogWrapper

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from './components'
export type { AlertDialogWrapperProps, AlertDialogIntent } from './alert-dialog.types'
