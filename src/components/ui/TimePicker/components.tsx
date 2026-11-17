/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { cn } from '@/utils/funcs/cn';
import { handleListKeyDown } from '@/utils/funcs/focus';
import type { KeyboardEvent } from 'react';
import type { TimeColumnProps } from './TimePicker.types';

const OPTION_SELECTOR = '[role="option"]';

const scrollIntoView = (node: HTMLButtonElement | null) => {
    node?.scrollIntoView?.({ block: 'nearest' });
};

/** One scrollable column of the time picker (hours, minutes, …). */
const TimeColumn = ({
    label,
    options,
    selected,
    onSelect,
}: TimeColumnProps) => {
    return (
        <div
            role="listbox"
            aria-label={label}
            data-slot="time-column"
            tabIndex={-1}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                handleListKeyDown(event, OPTION_SELECTOR)
            }
            className="flex max-h-56 w-14 [scrollbar-width:thin] flex-col gap-0.5 overflow-y-auto p-1 outline-none"
        >
            {options.map((option) => {
                const isSelected = option.value === selected;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        ref={isSelected ? scrollIntoView : undefined}
                        onClick={() => onSelect(option.value)}
                        className={cn(
                            'shrink-0 rounded-md px-2 py-1.5 text-center text-sm tabular-nums transition-colors outline-none',
                            'hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-primary/50',
                            isSelected &&
                                'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export { TimeColumn };
