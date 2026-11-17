import { describe, expect, it } from 'vitest';
import {
    filterTree,
    findOptions,
    flattenTree,
    getCheckState,
    getLeafValues,
    getParentValues,
    hasChildren,
    toggleOption,
    type TreeOption,
} from './tree';

const TREE: TreeOption[] = [
    {
        value: 'fruit',
        label: 'Fruit',
        children: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            {
                value: 'citrus',
                label: 'Citrus',
                children: [
                    { value: 'lemon', label: 'Lemon' },
                    { value: 'orange', label: 'Orange', disabled: true },
                ],
            },
        ],
    },
    { value: 'bread', label: 'Bread' },
];

const fruit = TREE[0];
const citrus = fruit.children![2];

describe('getLeafValues', () => {
    it('collects selectable leaves', () => {
        expect(getLeafValues(fruit)).toEqual(['apple', 'banana', 'lemon']);
    });

    it('returns a leaf itself', () => {
        expect(getLeafValues(TREE[1])).toEqual(['bread']);
    });

    it('skips disabled options and their subtrees', () => {
        expect(getLeafValues({ ...fruit, disabled: true })).toEqual([]);
    });
});

describe('getCheckState', () => {
    it('is unchecked, indeterminate or checked by its leaves', () => {
        expect(getCheckState(fruit, new Set())).toBe('unchecked');
        expect(getCheckState(fruit, new Set(['apple']))).toBe('indeterminate');
        expect(
            getCheckState(fruit, new Set(['apple', 'banana', 'lemon'])),
        ).toBe('checked');
    });

    it('ignores disabled leaves', () => {
        expect(getCheckState(citrus, new Set(['lemon']))).toBe('checked');
    });
});

describe('toggleOption', () => {
    it('selects every leaf of a parent', () => {
        expect(toggleOption(fruit, ['bread'])).toEqual([
            'bread',
            'apple',
            'banana',
            'lemon',
        ]);
    });

    it('fills in the rest of a partly selected parent', () => {
        expect(toggleOption(fruit, ['banana'])).toEqual([
            'banana',
            'apple',
            'lemon',
        ]);
    });

    it('unselects a fully selected parent', () => {
        expect(
            toggleOption(fruit, ['apple', 'bread', 'banana', 'lemon']),
        ).toEqual(['bread']);
    });

    it('toggles a leaf', () => {
        expect(toggleOption(TREE[1], [])).toEqual(['bread']);
        expect(toggleOption(TREE[1], ['bread'])).toEqual([]);
    });
});

describe('filterTree', () => {
    it('returns everything for an empty query', () => {
        expect(filterTree(TREE, '  ')).toBe(TREE);
    });

    it('keeps matches with their ancestors', () => {
        const result = filterTree(TREE, 'lem');
        expect(result).toHaveLength(1);
        expect(result[0].value).toBe('fruit');
        expect(result[0].children?.map((o) => o.value)).toEqual(['citrus']);
        expect(result[0].children?.[0].children?.map((o) => o.value)).toEqual([
            'lemon',
        ]);
    });

    it('keeps the whole subtree of a matching parent', () => {
        const result = filterTree(TREE, 'CITRUS');
        expect(result[0].children?.[0].children).toHaveLength(2);
    });

    it('returns nothing without matches', () => {
        expect(filterTree(TREE, 'zzz')).toEqual([]);
    });
});

describe('flattenTree, getParentValues and findOptions', () => {
    it('flattens depth-first', () => {
        expect(flattenTree(TREE).map((o) => o.value)).toEqual([
            'fruit',
            'apple',
            'banana',
            'citrus',
            'lemon',
            'orange',
            'bread',
        ]);
    });

    it('lists parents', () => {
        expect(getParentValues(TREE)).toEqual(['fruit', 'citrus']);
    });

    it('finds options by value in the given order', () => {
        expect(
            findOptions(TREE, ['lemon', 'nope', 'apple']).map((o) => o.label),
        ).toEqual(['Lemon', 'Apple']);
    });

    it('tells parents from leaves', () => {
        expect(hasChildren(fruit)).toBe(true);
        expect(hasChildren(TREE[1])).toBe(false);
        expect(hasChildren({ value: 'x', label: 'X', children: [] })).toBe(
            false,
        );
    });
});
