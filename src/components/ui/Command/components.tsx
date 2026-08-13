/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import { Search } from 'lucide-react';
import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '../Dialog/components';

interface CommandContextValue {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    shouldFilter: boolean;
    listRef: React.RefObject<HTMLDivElement | null>;
}

export const CommandContext = React.createContext<CommandContextValue | null>(
    null,
);

function useCommandContext() {
    const ctx = React.useContext(CommandContext);
    if (!ctx)
        throw new Error('Command components must be used within <Command>');
    return ctx;
}

const CommandInput = ({
    className,
    placeholder,
    value,
    onValueChange,
    ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onValueChange?: (val: string) => void;
}) => {
    const { search, setSearch } = useCommandContext();
    const isControlled = value !== undefined;
    const inputValue = isControlled ? (value as string) : search;

    return (
        <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
                className={cn(
                    'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => {
                    const val = e.target.value;
                    if (!isControlled) setSearch(val);
                    onValueChange?.(val);
                }}
                {...props}
            />
        </div>
    );
};

const CommandList = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const { listRef } = useCommandContext();
    return (
        <div ref={listRef} className={cn(className)} {...props}>
            {children}
        </div>
    );
};

const CommandEmpty = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    const { listRef } = useCommandContext();
    const [isEmpty, setIsEmpty] = React.useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useLayoutEffect(() => {
        if (!listRef.current) return;
        const items = listRef.current.querySelectorAll('[data-command-item]');
        const visibleCount = Array.from(items).filter(
            (el) => (el as HTMLElement).style.display !== 'none',
        ).length;
        setIsEmpty(visibleCount === 0);
    });

    if (!isEmpty) return null;

    return (
        <div
            className={cn(
                'py-6 text-center text-sm text-muted-foreground',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const CommandGroup = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn('overflow-hidden p-1', className)}
            role="group"
            {...props}
        >
            {children}
        </div>
    );
};

const CommandItem = ({
    children,
    value = '',
    keywords = [],
    className,
    onSelect,
    dir,
    ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
    value?: string;
    keywords?: string[];
    onSelect?: (value: string) => void;
    dir?: string;
}) => {
    const { search, shouldFilter } = useCommandContext();

    const isVisible = React.useMemo(() => {
        if (!shouldFilter || !search) return true;
        const q = search.toLowerCase();
        return (
            value.toLowerCase().includes(q) ||
            keywords.some((k) => k.toLowerCase().includes(q))
        );
    }, [search, shouldFilter, value, keywords]);

    return (
        <div
            data-command-item=""
            role="option"
            aria-selected={false}
            style={{ display: isVisible ? undefined : 'none' }}
            className={cn(
                'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground',
                className,
            )}
            /* c8 ignore next */
            onClick={() => isVisible && onSelect?.(value)}
            dir={dir}
            {...props}
        >
            {children}
        </div>
    );
};

const CommandDialog = ({
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    className,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
}) => {
    return (
        <Dialog {...props}>
            <DialogContent className={cn('overflow-hidden p-0', className)}>
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <DialogDescription className="sr-only">
                    {description}
                </DialogDescription>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
};
