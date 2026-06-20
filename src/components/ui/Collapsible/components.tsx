/* c8 ignore start */
'use client'
/* c8 ignore stop */

import * as React from 'react'
import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/src/utils/funcs/cn'

const CollapsibleContext = React.createContext(false)

function Collapsible({
    open,
    defaultOpen,
    onOpenChange,
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false)
    const controlled = open !== undefined
    const currentOpen = controlled ? open : isOpen

    const handleChange = (val: boolean) => {
        if (!controlled) setIsOpen(val)
        onOpenChange?.(val)
    }

    return (
        <CollapsibleContext.Provider value={currentOpen}>
            <CollapsiblePrimitive.Root
                data-slot='collapsible'
                open={currentOpen}
                onOpenChange={handleChange}
                {...props}
            />
        </CollapsibleContext.Provider>
    )
}

function CollapsibleTrigger({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            data-slot='collapsible-trigger'
            {...props}
        />
    )
}

function CollapsibleContent({
    className,
    children,
    ...props
}: Omit<React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>, 'forceMount'>) {
    const isOpen = React.useContext(CollapsibleContext)

    return (
        <CollapsiblePrimitive.CollapsibleContent
            data-slot='collapsible-content'
            forceMount
            asChild
            {...props}
        >
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key='collapsible-content'
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
    )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
