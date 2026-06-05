'use client';

import type { FC } from 'react';
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from './components';
import type { AccordionWrapperProps } from './accordion.types';

const AccordionWrapper: FC<AccordionWrapperProps> = ({
    value,
    className,
    disabled,
    trigger,
    children,
    itemProps,
    triggerProps,
    contentProps,
}) => {
    return (
        <AccordionItem value={value} className={className} disabled={disabled} {...itemProps}>
            <AccordionTrigger {...triggerProps}>{trigger}</AccordionTrigger>
            <AccordionContent {...contentProps}>{children}</AccordionContent>
        </AccordionItem>
    );
};

export default AccordionWrapper;

