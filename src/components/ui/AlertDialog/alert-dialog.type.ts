// alert-dialog.type.ts
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
    // ─── Trigger ──────────────────────────────────────────────
    trigger: ReactNode;

    // ─── Content ──────────────────────────────────────────────
    title: ReactNode;
    description?: ReactNode;
    media?: ReactNode;
    children?: ReactNode;

    // ─── Structural Props ─────────────────────────────────────
    contentProps?: ContentProps;
    headerProps?: React.ComponentProps<'div'>;
    footerProps?: React.ComponentProps<'div'>;

    // ─── Action Button ────────────────────────────────────────
    actionText?: ReactNode;
    actionProps?: ActionProps;

    // ─── Cancel Button ────────────────────────────────────────
    cancelText?: ReactNode;
    cancelProps?: CancelProps;

    // ─── Root ─────────────────────────────────────────────────
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

