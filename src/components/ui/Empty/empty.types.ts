import { ReactNode } from 'react';

export type EmptyGroupProps = {
    media?: ReactNode;
    title?: string;
    description?: string;
    mediaVariant?: 'icon' | 'default';
    children: ReactNode;
};

