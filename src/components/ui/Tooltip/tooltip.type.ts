import { ReactNode } from 'react';

export type TooltipProps = {
    trigger: ReactNode;
    children: ReactNode;
    side: 'left' | 'top' | 'bottom' | 'right';
};

