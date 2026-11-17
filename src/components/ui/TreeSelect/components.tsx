/* c8 ignore start */
'use client';
/* c8 ignore stop */

import { checkboxVariants } from '@/components/ui/Checkbox/components';
import { cn } from '@/utils/funcs/cn';
import { CheckIcon, ChevronRightIcon, MinusIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { TreeSelectNodeProps } from './TreeSelect.types';
import { hasChildren, type CheckState } from './utils/tree/tree';

const INDENT_PX = 16;

/** A visual checkbox; the tree item itself carries aria-checked. */
const TreeCheckbox = ({ state }: { state: CheckState }) => (
    <span
        aria-hidden
        data-state={state}
        className={cn(
            checkboxVariants(),
            'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
        )}
    >
        {state === 'checked' && <CheckIcon className="size-3.5" />}
        {state === 'indeterminate' && <MinusIcon className="size-3.5" />}
    </span>
);

/** One option and, while expanded, its children. */
const TreeSelectNode = (props: TreeSelectNodeProps) => {
    const {
        option,
        level,
        multiple,
        isExpanded,
        onExpandedChange,
        checkState,
        onSelect,
    } = props;
    const isParent = hasChildren(option);
    const expanded = isExpanded(option);
    const state = checkState(option);

    const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
        if (event.target !== event.currentTarget) return;
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        const open = rtl ? 'ArrowLeft' : 'ArrowRight';
        const close = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(option);
        } else if (event.key === open && isParent && !expanded) {
            event.preventDefault();
            onExpandedChange(option, true);
        } else if (event.key === close && expanded) {
            event.preventDefault();
            onExpandedChange(option, false);
        }
    };

    return (
        <li
            role="treeitem"
            tabIndex={-1}
            aria-level={level + 1}
            aria-expanded={isParent ? expanded : undefined}
            aria-checked={
                multiple
                    ? state === 'indeterminate'
                        ? 'mixed'
                        : state === 'checked'
                    : undefined
            }
            aria-selected={multiple ? undefined : state === 'checked'}
            aria-disabled={option.disabled || undefined}
            onKeyDown={handleKeyDown}
            className="outline-none focus-visible:[&>[data-slot=tree-row]]:ring-3 focus-visible:[&>[data-slot=tree-row]]:ring-primary/50"
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the tree item handles the keyboard */}
            <div
                data-slot="tree-row"
                onClick={() => onSelect(option)}
                style={{ paddingInlineStart: level * INDENT_PX + 4 }}
                className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md py-1.5 pe-2 text-sm select-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    !multiple &&
                        state === 'checked' &&
                        'bg-primary/10 font-medium',
                    option.disabled && 'pointer-events-none opacity-50',
                )}
            >
                {isParent ? (
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={
                            expanded
                                ? `Collapse ${option.label}`
                                : `Expand ${option.label}`
                        }
                        onClick={(event) => {
                            event.stopPropagation();
                            onExpandedChange(option, !expanded);
                        }}
                        className="flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronRightIcon
                            className={cn(
                                'size-4 transition-transform rtl:rotate-180',
                                expanded && 'rotate-90 rtl:rotate-90',
                            )}
                        />
                    </button>
                ) : (
                    <span aria-hidden className="size-4 shrink-0" />
                )}
                {multiple && <TreeCheckbox state={state} />}
                <span className="flex-1 truncate">{option.label}</span>
                {!multiple && state === 'checked' && (
                    <CheckIcon aria-hidden className="size-3.5 shrink-0" />
                )}
            </div>
            {expanded && (
                <ul role="group">
                    {(option.children ?? []).map((child) => (
                        <TreeSelectNode
                            {...props}
                            key={child.value}
                            option={child}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export { TreeCheckbox, TreeSelectNode };
