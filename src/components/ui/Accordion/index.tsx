import React, { FC } from 'react';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './components';
import { AccordionProps } from './accordion.props';

const AccordionGroup: FC<AccordionProps> = ({ value, trigger, children }) => {
    return (
        <AccordionItem value={value}>
            <AccordionTrigger>{trigger}</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
    );
};

export default AccordionGroup;

