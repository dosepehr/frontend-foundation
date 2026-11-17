/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Badge from '@/components/ui/Badge';
import Field, {
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/Field';
import Popover, {
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import Spinner from '@/components/ui/Spinner';
import { cn } from '@/utils/funcs/cn';
import { handleListKeyDown, moveFocus } from '@/utils/funcs/focus';
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { TreeSelectNode } from './components';
import { useTreeSelect } from './hooks/useTreeSelect/useTreeSelect';
import type { TreeSelectProps } from './TreeSelect.types';

const ITEM_SELECTOR = '[role="treeitem"]';

// Same look as the DatePicker and ComboBox triggers.
const TRIGGER_CLASS = cn(
    'group/trigger flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border] outline-none select-none',
    'border-input/50 hover:enabled:not-aria-invalid:border-primary',
    'focus-visible:not-aria-invalid:border-primary focus-visible:not-aria-invalid:ring-3 focus-visible:not-aria-invalid:ring-primary/50',
    'aria-expanded:not-aria-invalid:border-primary aria-expanded:not-aria-invalid:ring-3 aria-expanded:not-aria-invalid:ring-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/50 aria-invalid:hover:border-destructive',
);

const TreeSelect = ({
    options,
    selected,
    onChange,
    multiple = true,
    defaultExpanded,
    label,
    description,
    placeholder = 'Select options',
    searchPlaceholder = 'Search',
    notFoundText = 'No results found.',
    required,
    disabled,
    isPending = false,
    isError = false,
    loadingText = 'Loading...',
    errorText = 'Failed to load',
    error,
    hideSelectedBadges = false,
    className,
}: TreeSelectProps) => {
    const triggerId = useId();
    const treeRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const tree = useTreeSelect({
        options,
        selected,
        onChange,
        multiple,
        defaultExpanded,
        onSelectSingle: () => setOpen(false),
    });

    const triggerText =
        multiple && tree.selectedOptions.length > 1
            ? `${tree.selectedOptions.length} selected`
            : tree.selectedOptions[0]?.label;
    const hasSelection = !!triggerText && !isPending && !isError;

    return (
        <Field
            data-invalid={!!error || undefined}
            className={cn('relative pb-1', className)}
        >
            {label && (
                <FieldLabel
                    htmlFor={triggerId}
                    required={required}
                    className="text-foreground"
                >
                    {label}
                </FieldLabel>
            )}
            {description && (
                <FieldDescription className="text-muted-foreground">
                    {description}
                </FieldDescription>
            )}
            <Popover
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) tree.setSearch('');
                }}
            >
                <PopoverTrigger asChild>
                    {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- popover triggers expose their state with aria-expanded */}
                    <button
                        type="button"
                        id={triggerId}
                        disabled={disabled || isPending || isError}
                        aria-busy={isPending || undefined}
                        aria-expanded={open}
                        aria-invalid={!!error || undefined}
                        className={TRIGGER_CLASS}
                    >
                        {isPending && (
                            <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">
                                <Spinner aria-hidden />
                            </span>
                        )}
                        <span
                            className={cn(
                                'flex-1 truncate text-start',
                                hasSelection
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {isPending
                                ? loadingText
                                : isError
                                  ? errorText
                                  : (triggerText ?? placeholder)}
                        </span>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn(
                                'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                open && 'rotate-180',
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    aria-label={label ?? placeholder}
                    sideOffset={5}
                    className="popover-content-width-full p-0"
                >
                    <div className="flex items-center gap-2 border-b border-border px-3">
                        <SearchIcon
                            aria-hidden
                            className="size-4 shrink-0 text-muted-foreground"
                        />
                        <input
                            type="search"
                            aria-label={searchPlaceholder}
                            placeholder={searchPlaceholder}
                            value={tree.search}
                            onChange={(event) =>
                                tree.setSearch(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key !== 'ArrowDown' ||
                                    !treeRef.current
                                )
                                    return;
                                event.preventDefault();
                                moveFocus(
                                    treeRef.current,
                                    ITEM_SELECTOR,
                                    'first',
                                );
                            }}
                            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
                        />
                    </div>
                    {tree.visibleOptions.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            {notFoundText}
                        </p>
                    ) : (
                        <ul
                            ref={treeRef}
                            role="tree"
                            aria-label={label ?? placeholder}
                            aria-multiselectable={multiple || undefined}
                            tabIndex={0}
                            onKeyDown={(event) =>
                                handleListKeyDown(event, ITEM_SELECTOR)
                            }
                            onWheel={(event) => event.stopPropagation()}
                            className="max-h-64 overflow-y-auto p-1 outline-none"
                        >
                            {tree.visibleOptions.map((option) => (
                                <TreeSelectNode
                                    key={option.value}
                                    option={option}
                                    level={0}
                                    multiple={multiple}
                                    isExpanded={tree.isExpanded}
                                    onExpandedChange={tree.setExpandedFor}
                                    checkState={tree.checkState}
                                    onSelect={tree.select}
                                />
                            ))}
                        </ul>
                    )}
                </PopoverContent>
            </Popover>

            {multiple &&
                !hideSelectedBadges &&
                tree.selectedOptions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {tree.selectedOptions.map((option) => (
                            <Badge
                                key={option.value}
                                variant="default"
                                appearance="soft"
                            >
                                {option.label}
                                {!disabled && !isPending && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            tree.remove(option.value)
                                        }
                                        aria-label={`Remove ${option.label}`}
                                    >
                                        <XIcon className="size-3" />
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                )}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
};

export default TreeSelect;
