'use client';

import { useMemo, useState } from 'react';
import {
    filterTree,
    findOptions,
    getCheckState,
    getParentValues,
    hasChildren,
    toggleOption,
    type TreeOption,
} from '../../utils/tree/tree';

export type UseTreeSelectOptions = {
    options: TreeOption[];
    selected: string[];
    onChange?: (values: string[]) => void;
    /** Checkboxes with cascading parents; otherwise one leaf is picked. */
    multiple?: boolean;
    /** Parents expanded on first render, or 'all'. */
    defaultExpanded?: string[] | 'all';
    onSelectSingle?: () => void;
};

/** Search, expansion and selection state of a tree select. */
export function useTreeSelect({
    options,
    selected,
    onChange,
    multiple = true,
    defaultExpanded = [],
    onSelectSingle,
}: UseTreeSelectOptions) {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(
        () =>
            new Set(
                defaultExpanded === 'all'
                    ? getParentValues(options)
                    : defaultExpanded,
            ),
    );

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const visibleOptions = useMemo(
        () => filterTree(options, search),
        [options, search],
    );
    const selectedOptions = useMemo(
        () => findOptions(options, selected),
        [options, selected],
    );
    const isSearching = search.trim() !== '';

    const isExpanded = (option: TreeOption) =>
        hasChildren(option) && (isSearching || expanded.has(option.value));

    const setExpandedFor = (option: TreeOption, open: boolean) => {
        if (!hasChildren(option)) return;
        const next = new Set(expanded);
        if (open) next.add(option.value);
        else next.delete(option.value);
        setExpanded(next);
    };

    const select = (option: TreeOption) => {
        if (option.disabled) return;
        if (multiple) {
            onChange?.(toggleOption(option, selected));
        } else if (hasChildren(option)) {
            setExpandedFor(option, !isExpanded(option));
        } else {
            onChange?.([option.value]);
            onSelectSingle?.();
        }
    };

    return {
        search,
        setSearch,
        visibleOptions,
        selectedOptions,
        isExpanded,
        setExpandedFor,
        select,
        remove: (value: string) =>
            onChange?.(selected.filter((item) => item !== value)),
        checkState: (option: TreeOption) => getCheckState(option, selectedSet),
    };
}
