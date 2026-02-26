import { ReactNode } from 'react';

export type ItemProps = {
    title?: ReactNode;
    description?: ReactNode;
    media?: ReactNode;
    mediaVariant?: 'default' | 'icon' | 'image';
    actions?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    variant?: 'default' | 'outline' | 'muted';
    size?: 'default' | 'sm' | 'xs';
};

