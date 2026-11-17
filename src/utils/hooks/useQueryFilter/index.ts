'use client';

import { filterParsers } from '@/utils/funcs/filterParsers';
import type { Filter, FilterType } from '@/utils/funcs/filters';
import { useQueryState, type Options, type SingleParserBuilder } from 'nuqs';

/** The value type of a filter type, e.g. `string[]` for 'multiselect'. */
export type FilterValueOf<Type extends FilterType> = NonNullable<
    Extract<Filter, { type: Type }>['value']
>;

export type QueryFilterState<Type extends FilterType> = {
    /** The value in the URL; null when the param is absent. */
    value: FilterValueOf<Type> | null;
    /** Writes the value to the URL; null or an empty value removes the param. */
    onChange: (value: FilterValueOf<Type> | null) => void;
};

const isEmpty = (value: unknown) =>
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

/**
 * Keeps a filter's value in the URL query string under `key`. Spread the
 * result into a filter (`{ type: 'select', label, options, ...status }`),
 * or into DataFilter's `search` / `sort`. Needs a nuqs adapter above it.
 *
 * @example
 * const status = useQueryFilter('status', 'multiselect');
 * const created = useQueryFilter('created', 'date');
 */
export function useQueryFilter<Type extends FilterType>(
    key: string,
    type: Type,
    options: Options = {},
): QueryFilterState<Type> {
    const parser = filterParsers[type] as SingleParserBuilder<unknown>;
    const [value, setValue] = useQueryState(key, parser.withOptions(options));

    // Each type's parser yields exactly that type's value, so the state can
    // be narrowed to it here, at the one place the lookup table is read.
    return {
        value,
        onChange: (next) => void setValue(isEmpty(next) ? null : next),
    } as QueryFilterState<Type>;
}
