import { Button, } from '@/components/ui/Button';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { ReactNode } from 'react';

type ButtonVariantProps = Pick<
    React.ComponentProps<typeof Button>,
    'variant' | 'size'
>;

type ContentProps = Omit<
    React.ComponentProps<typeof AlertDialogPrimitive.Content>,
    'children'
> & { size?: 'default' | 'sm' };

type ActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> &
    ButtonVariantProps;

type CancelProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
    ButtonVariantProps;

export interface AlertDialogGroupProps {
    trigger: ReactNode;

    title: ReactNode;
    description?: ReactNode;
    media?: ReactNode;
    children?: ReactNode;

    contentProps?: ContentProps;
    headerProps?: React.ComponentProps<'div'>;
    footerProps?: React.ComponentProps<'div'>;

    actionText?: ReactNode;
    actionProps?: ActionProps;

    cancelText?: ReactNode;
    cancelProps?: CancelProps;

    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

