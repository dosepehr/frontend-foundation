/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import { AnimatePresence, motion } from 'motion/react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import * as React from 'react';

export const CollapsibleContext = React.createContext(false);

const CollapsibleTrigger = ({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) => {
    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            data-slot="collapsible-trigger"
            {...props}
        />
    );
};

const CollapsibleContent = ({
    className,
    children,
    ...props
}: Omit<
    React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>,
    'forceMount'
>) => {
    const isOpen = React.useContext(CollapsibleContext);

    return (
        <CollapsiblePrimitive.CollapsibleContent
            data-slot="collapsible-content"
            forceMount
            asChild
            {...props}
        >
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="collapsible-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                        className={cn(className)}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </CollapsiblePrimitive.CollapsibleContent>
    );
};

export { CollapsibleContent, CollapsibleTrigger };
