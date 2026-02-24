// index.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './components';
import { FC } from 'react';
import { AlertDialogGroupProps } from './alert-dialog.type';

const AlertDialogGroup: FC<AlertDialogGroupProps> = ({
    // Root
    open,
    defaultOpen,
    onOpenChange,

    // Trigger
    trigger,

    // Content structure
    title,
    description,
    media,
    children,

    // Structural prop overrides
    contentProps,
    headerProps,
    footerProps,

    // Action
    actionText = 'Continue',
    actionProps,

    // Cancel
    cancelText = 'Cancel',
    cancelProps,
}) => {
    const { size: contentSize = 'default', ...restContentProps } =
        contentProps ?? {};

    return (
        <AlertDialog
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
        >
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent size={contentSize} {...restContentProps}>
                <AlertDialogHeader {...headerProps}>
                    {media && <AlertDialogMedia>{media}</AlertDialogMedia>}
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                    {children}
                </AlertDialogHeader>

                <AlertDialogFooter {...footerProps}>
                    <AlertDialogCancel variant='outline' {...cancelProps}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction variant='default' {...actionProps}>
                        {actionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogGroup;

