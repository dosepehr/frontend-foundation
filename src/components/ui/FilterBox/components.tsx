/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PopoverTrigger } from '@/components/ui/Popover';
import Separator from '@/components/ui/Separator';
import { cn } from '@/utils/funcs/cn';
import { handleListKeyDown } from '@/utils/funcs/focus';
import { ChevronRightIcon, FilterIcon, XIcon } from 'lucide-react';
import type {
    FilterListProps,
    FilterPanelProps,
    FilterRowProps,
    FilterTriggerProps,
} from './FilterBox.types';

// Matches the search input and sort select: border, shadow, radius, states.
const FIELD_BUTTON_CLASS = cn(
    'rounded-md border-input/50 bg-transparent shadow-xs',
    'hover:border-primary hover:bg-transparent',
    'aria-expanded:border-primary aria-expanded:bg-transparent',
    'focus-visible:border-primary focus-visible:ring-primary/50',
    'dark:border-input/50 dark:bg-transparent dark:hover:bg-transparent',
);

const ROW_SELECTOR = '[data-slot="filter-row"]';

/** The "Filter" button, joined with an X that clears every filter. */
const FilterTrigger = ({
    hasActive,
    disabled,
    onReset,
    labels,
    className,
}: FilterTriggerProps) => (
    <div data-slot="filter-box" className={cn('flex w-fit', className)}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                size="lg"
                disabled={disabled}
                className={cn(
                    FIELD_BUTTON_CLASS,
                    hasActive && 'rounded-e-none text-primary',
                )}
            >
                {labels.trigger}
                <FilterIcon aria-hidden />
            </Button>
        </PopoverTrigger>
        {hasActive && (
            <Button
                variant="outline"
                size="icon-lg"
                aria-label={labels.reset}
                disabled={disabled}
                onClick={onReset}
                className={cn(
                    FIELD_BUTTON_CLASS,
                    'rounded-s-none border-s-0 text-destructive',
                )}
            >
                <XIcon aria-hidden />
            </Button>
        )}
    </div>
);

/** One filter in the list: label, count and a summary of its value. */
const FilterRow = ({ filter, summary, count, onOpen }: FilterRowProps) => (
    <li>
        <button
            type="button"
            data-slot="filter-row"
            onClick={onOpen}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-primary/50"
        >
            <span className="flex shrink-0 items-center gap-1.5">
                {filter.label}
                {count >= 2 && (
                    <Badge
                        variant="default"
                        appearance="soft"
                        className="h-4 min-w-4 px-1 text-[10px]"
                    >
                        {count}
                    </Badge>
                )}
            </span>
            <span
                data-slot="filter-summary"
                dir="auto"
                className="ms-auto min-w-0 truncate text-xs text-muted-foreground"
            >
                {summary}
            </span>
            <ChevronRightIcon
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
            />
        </button>
    </li>
);

/** The list view: every filter, plus "clear filters". */
const FilterList = ({
    rows,
    onOpenFilter,
    onReset,
    labels,
}: FilterListProps) => (
    <div className="flex flex-col">
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-semibold">{labels.title}</span>
            <Button
                variant="link"
                size="xs"
                className="text-muted-foreground hover:text-destructive"
                onClick={onReset}
            >
                {labels.clearAll}
            </Button>
        </div>
        <Separator />
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- arrow keys move focus between the row buttons */}
        <ul
            aria-label={labels.title}
            onKeyDown={(event) => handleListKeyDown(event, ROW_SELECTOR)}
            className="flex max-h-72 flex-col overflow-y-auto pt-1"
        >
            {rows.map(({ id, ...row }) => (
                <FilterRow key={id} {...row} onOpen={() => onOpenFilter(id)} />
            ))}
        </ul>
    </div>
);

/** The view of one filter: a back header, its input and a back button. */
const FilterPanel = ({
    filter,
    onBack,
    labels,
    children,
}: FilterPanelProps) => (
    <div className="flex flex-col">
        <button
            type="button"
            onClick={onBack}
            aria-label={`${labels.back}: ${filter.label}`}
            className="mb-1.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-start text-sm font-semibold outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-primary/50"
        >
            {filter.label}
            <ChevronRightIcon
                aria-hidden
                className="ms-auto size-4 text-muted-foreground rtl:rotate-180"
            />
        </button>
        <Separator />
        <div data-slot="filter-panel-input" className="px-2 py-3">
            {children}
        </div>
        <div className="flex justify-end px-2 pb-1">
            <Button variant="outline" size="sm" onClick={onBack}>
                {labels.back}
            </Button>
        </div>
    </div>
);

export { FilterList, FilterPanel, FilterRow, FilterTrigger };
