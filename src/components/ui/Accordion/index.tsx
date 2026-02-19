import React, { FC } from 'react';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './components';
import { AccordionProps } from './accordion.props';

const AccordionGroup: FC<AccordionProps> = ({
    value,
    trigger,
    children,
    contentClasses,
    itemClasses,
    triggerClasses,
}) => {
    return (
        <AccordionItem value={value} className={itemClasses}>
            <AccordionTrigger className={triggerClasses}>
                {trigger}
            </AccordionTrigger>
            <AccordionContent className={contentClasses}>
                {children}
            </AccordionContent>
        </AccordionItem>
    );
};

export default AccordionGroup;

