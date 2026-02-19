import { ReactNode } from 'react';

export type AccordionProps = {
    value: string;
    trigger: ReactNode;
    children: ReactNode;
    itemClasses?: string;
    triggerClasses?: string;
    contentClasses?: string;
};

