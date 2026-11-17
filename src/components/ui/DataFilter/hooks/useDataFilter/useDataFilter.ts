'use client';

import { useState } from 'react';

export type UseDataFilterOptions = {
    /** The applied search term. */
    search?: string;
    onSearchChange?: (search: string) => void;
};

/**
 * The search text of a DataFilter while it is being typed; the debounced
 * search box applies it. Follows search changes made elsewhere (the URL,
 * the back button, another control).
 */
export function useDataFilter({
    search = '',
    onSearchChange,
}: UseDataFilterOptions) {
    const [searchText, setSearchText] = useState(search);
    const [syncedSearch, setSyncedSearch] = useState(search);

    if (search !== syncedSearch) {
        setSyncedSearch(search);
        setSearchText(search);
    }

    return {
        searchText,
        setSearchText,
        /** Applies the search; skipped when nothing changed. */
        commitSearch: (next: string) => {
            if (next !== search) onSearchChange?.(next);
        },
    };
}
