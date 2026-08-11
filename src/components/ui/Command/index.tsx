/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/src/utils/funcs/cn';
import * as React from 'react';
import { CommandContext } from './components';

const Command = ({
    children,
    shouldFilter = true,
    className,
    onSearchChange,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    shouldFilter?: boolean;
    onSearchChange?: (val: string) => void;
}) => {
    const [search, setSearch] = React.useState('');
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const handleSetSearch: React.Dispatch<React.SetStateAction<string>> =
        React.useCallback(
            (val) => {
                /* c8 ignore next */
                const next = typeof val === 'function' ? val(search) : val;
                setSearch(next);
                onSearchChange?.(next);
            },
            [search, onSearchChange],
        );

    return (
        <CommandContext.Provider
            value={{
                search,
                setSearch: handleSetSearch,
                shouldFilter,
                listRef,
            }}
        >
            <div
                className={cn(
                    'flex flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </CommandContext.Provider>
    );
};

export {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './components';

export default Command;
