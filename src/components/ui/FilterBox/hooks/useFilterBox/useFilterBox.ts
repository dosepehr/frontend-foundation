'use client';

import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import {
    clearFilters,
    hasActiveFilters,
    selectedCount,
    summarizeFilter,
    type Filter,
    type Filters,
    type NumberRange,
    type SummaryOptions,
} from '@/utils/funcs/filters';
import { useState } from 'react';

export type UseFilterBoxOptions = {
    filters: Filters;
    /** Clears the filters; defaults to calling every `onChange` with null. */
    onReset?: () => void;
    /** Delay before text, number-range and server-search changes apply. */
    debounceMs?: number;
    summaryOptions: SummaryOptions;
};

const isEmptyRange = ({ from, to }: NumberRange) =>
    from === undefined && to === undefined;

/**
 * State of a FilterBox: which filter is open, and drafts of text and
 * number-range filters that apply after typing stops. Leaving a filter
 * applies its draft at once; resetting drops every pending change.
 */
export function useFilterBox({
    filters,
    onReset,
    debounceMs = 500,
    summaryOptions,
}: UseFilterBoxOptions) {
    const [open, setOpenState] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [textDrafts, setTextDrafts] = useState<Record<string, string>>({});
    const [rangeDrafts, setRangeDrafts] = useState<Record<string, NumberRange>>(
        {},
    );
    const [searchedIds, setSearchedIds] = useState<ReadonlySet<string>>(
        new Set(),
    );

    // Debounced callbacks read the latest filters and drafts when they fire.
    const commitText = useDebouncedCallback((id: string) => {
        const filter = filters[id];
        if (filter?.type === 'text')
            filter.onChange(textDrafts[id]?.trim() || null);
    }, debounceMs);
    const commitRange = useDebouncedCallback((id: string) => {
        const filter = filters[id];
        const draft = rangeDrafts[id];
        if (filter?.type !== 'number-range' || !draft) return;
        filter.onChange(isEmptyRange(draft) ? null : draft);
    }, debounceMs);
    const commitSearch = useDebouncedCallback((id: string, search: string) => {
        const filter = filters[id];
        if (filter?.type === 'select' || filter?.type === 'multiselect') {
            filter.onSearchChange?.(search);
        }
    }, debounceMs);

    const leaveFilter = () => {
        commitText.flush();
        commitRange.flush();
        commitSearch.flush();
        setTextDrafts({});
        setRangeDrafts({});
        setActiveId(null);
    };

    const reset = () => {
        commitText.cancel();
        commitRange.cancel();
        commitSearch.cancel();
        setTextDrafts({});
        setRangeDrafts({});
        for (const id of searchedIds) {
            const filter = filters[id];
            if (filter?.type === 'select' || filter?.type === 'multiselect') {
                filter.onSearchChange?.('');
            }
        }
        setSearchedIds(new Set());
        if (onReset) onReset();
        else clearFilters(filters);
        setActiveId(null);
    };

    /** A filter wired for editing in its panel. */
    const editable = (id: string, filter: Filter): Filter => {
        switch (filter.type) {
            case 'text':
                return {
                    ...filter,
                    value: textDrafts[id] ?? filter.value,
                    onChange: (value: string | null) => {
                        setTextDrafts((drafts) => ({
                            ...drafts,
                            [id]: value ?? '',
                        }));
                        commitText.run(id);
                    },
                };
            case 'number-range':
                return {
                    ...filter,
                    value: rangeDrafts[id] ?? filter.value,
                    onChange: (value: NumberRange | null) => {
                        setRangeDrafts((drafts) => ({
                            ...drafts,
                            [id]: value ?? {},
                        }));
                        commitRange.run(id);
                    },
                };
            case 'select':
            case 'multiselect':
                return filter.onSearchChange
                    ? {
                          ...filter,
                          onSearchChange: (search) => {
                              if (!searchedIds.has(id))
                                  setSearchedIds(new Set([...searchedIds, id]));
                              commitSearch.run(id, search);
                          },
                      }
                    : filter;
            default:
                return filter;
        }
    };

    const active = activeId === null ? undefined : filters[activeId];

    return {
        open,
        setOpen: (next: boolean) => {
            if (!next) leaveFilter();
            setOpenState(next);
        },
        hasActive: hasActiveFilters(filters),
        rows: Object.entries(filters).map(([id, filter]) => ({
            id,
            filter,
            summary: summarizeFilter(filter, summaryOptions),
            count: selectedCount(filter),
        })),
        /** The open filter, wired for editing; undefined on the list. */
        activeFilter:
            activeId && active ? editable(activeId, active) : undefined,
        openFilter: setActiveId,
        back: leaveFilter,
        reset,
    };
}
