// Helpers for selecting from nested options. Selection is stored as leaf
// values only; a parent's state is derived from its leaves.

import { toLatinDigits } from '@/utils/funcs/numberFormat';

export type TreeOption = {
    value: string;
    label: string;
    children?: TreeOption[];
    disabled?: boolean;
};

export type CheckState = 'checked' | 'unchecked' | 'indeterminate';

/** Whether `option` has at least one child. */
export const hasChildren = (option: TreeOption) =>
    (option.children?.length ?? 0) > 0;

/** Values of the selectable leaves under `option` (itself, if it is a leaf). */
export function getLeafValues(option: TreeOption): string[] {
    if (option.disabled) return [];
    if (!hasChildren(option)) return [option.value];
    return (option.children ?? []).flatMap(getLeafValues);
}

/** Checked when every selectable leaf is selected, indeterminate when some are. */
export function getCheckState(
    option: TreeOption,
    selected: ReadonlySet<string>,
): CheckState {
    const leaves = getLeafValues(option);
    const count = leaves.filter((leaf) => selected.has(leaf)).length;
    if (count === 0) return 'unchecked';
    return count === leaves.length ? 'checked' : 'indeterminate';
}

/**
 * Selects every leaf under `option`, or unselects them all when they are
 * already all selected. Keeps the order of `selected`.
 */
export function toggleOption(option: TreeOption, selected: string[]) {
    const leaves = getLeafValues(option);
    const set = new Set(selected);
    if (getCheckState(option, set) === 'checked') {
        return selected.filter((value) => !leaves.includes(value));
    }
    return [...selected, ...leaves.filter((leaf) => !set.has(leaf))];
}

/**
 * Keeps options whose label matches `query` (case-insensitive, digits in any
 * script) with their whole subtree, plus the ancestors of matches.
 */
export function filterTree(options: TreeOption[], query: string): TreeOption[] {
    const needle = toLatinDigits(query.trim()).toLowerCase();
    if (!needle) return options;
    return options.flatMap((option) => {
        if (toLatinDigits(option.label).toLowerCase().includes(needle))
            return [option];
        const children = filterTree(option.children ?? [], needle);
        return children.length > 0 ? [{ ...option, children }] : [];
    });
}

/** Every option in depth-first order. */
export function flattenTree(options: TreeOption[]): TreeOption[] {
    return options.flatMap((option) => [
        option,
        ...flattenTree(option.children ?? []),
    ]);
}

/** Values of every option that has children. */
export function getParentValues(options: TreeOption[]) {
    return flattenTree(options)
        .filter(hasChildren)
        .map((option) => option.value);
}

/** The options for `values`, in the order given; unknown values are skipped. */
export function findOptions(options: TreeOption[], values: string[]) {
    const byValue = new Map(
        flattenTree(options).map((option) => [option.value, option]),
    );
    return values.flatMap((value) => byValue.get(value) ?? []);
}
