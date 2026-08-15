import { renderHook } from '@testing-library/react';
import { useOptions } from '.';

interface Fruit {
    id: string;
    title: string;
    active: boolean;
}

const FRUITS: Fruit[] = [
    { id: '2', title: 'Banana', active: true },
    { id: '1', title: 'Apple', active: false },
    { id: '3', title: 'Cherry', active: true },
];

const isActive = (item: Fruit) => item.active;

describe('useOptions', () => {
    it('maps id/title to value/label by default, stringifying the value', () => {
        const { result } = renderHook(() => useOptions(FRUITS));
        expect(result.current).toEqual([
            { value: '2', label: 'Banana' },
            { value: '1', label: 'Apple' },
            { value: '3', label: 'Cherry' },
        ]);
    });

    it('defaults to an empty array when no data is passed', () => {
        const { result } = renderHook(() => useOptions());
        expect(result.current).toEqual([]);
    });

    it('uses valueAccessor and labelAccessor when provided', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                valueAccessor: (item) => item.id,
                labelAccessor: (item) => item.title.toUpperCase(),
            }),
        );
        expect(result.current).toEqual([
            { value: '2', label: 'BANANA' },
            { value: '1', label: 'APPLE' },
            { value: '3', label: 'CHERRY' },
        ]);
    });

    it('filters out items that fail the predicate', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, { filter: (item) => item.active }),
        );
        expect(result.current).toEqual([
            { value: '2', label: 'Banana' },
            { value: '3', label: 'Cherry' },
        ]);
    });

    it('sorts items without mutating the source array', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                sort: (a, b) => a.title.localeCompare(b.title),
            }),
        );
        expect(result.current).toEqual([
            { value: '1', label: 'Apple' },
            { value: '2', label: 'Banana' },
            { value: '3', label: 'Cherry' },
        ]);
        expect(FRUITS.map((f) => f.id)).toEqual(['2', '1', '3']);
    });

    it('applies transform before filter and sort', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                transform: (item) => ({ ...item, active: true }),
                filter: (item) => item.active,
            }),
        );
        expect(result.current).toHaveLength(3);
    });

    it('merges metaAccessor fields onto each option', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                metaAccessor: (item) => ({ disabled: !item.active }),
            }),
        );
        expect(result.current).toEqual([
            { value: '2', label: 'Banana', disabled: false },
            { value: '1', label: 'Apple', disabled: true },
            { value: '3', label: 'Cherry', disabled: false },
        ]);
    });

    it('omits meta fields entirely when metaAccessor is not provided', () => {
        const { result } = renderHook(() => useOptions(FRUITS));
        expect(Object.keys(result.current[0]!)).toEqual(['value', 'label']);
    });

    it('prepends includeEmptyOption ahead of filtered/sorted items', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                filter: (item) => item.active,
                includeEmptyOption: { value: '', label: 'All' },
            }),
        );
        expect(result.current).toEqual([
            { value: '', label: 'All' },
            { value: '2', label: 'Banana' },
            { value: '3', label: 'Cherry' },
        ]);
    });

    it('applies includeEmptyOption.meta to the empty option', () => {
        const { result } = renderHook(() =>
            useOptions(FRUITS, {
                includeEmptyOption: {
                    value: '',
                    label: 'All',
                    meta: { disabled: true },
                },
            }),
        );
        expect(result.current[0]).toEqual({
            value: '',
            label: 'All',
            disabled: true,
        });
    });

    it('returns the same array reference across re-renders when data and config are stable', () => {
        const { result, rerender } = renderHook(() =>
            useOptions(FRUITS, { filter: isActive }),
        );
        const first = result.current;
        rerender();
        expect(result.current).toBe(first);
    });

    it('recomputes when a config callback reference changes, even though data did not', () => {
        const { result, rerender } = renderHook(
            ({ query }: { query: string }) =>
                useOptions(FRUITS, {
                    filter: (item) => item.title.includes(query),
                }),
            { initialProps: { query: 'a' } },
        );
        expect(result.current).toEqual([{ value: '2', label: 'Banana' }]);

        rerender({ query: 'Ch' });
        expect(result.current).toEqual([{ value: '3', label: 'Cherry' }]);
    });

    it('recomputes when data changes', () => {
        const { result, rerender } = renderHook(
            ({ data }: { data: Fruit[] }) => useOptions(data),
            { initialProps: { data: FRUITS } },
        );
        expect(result.current).toHaveLength(3);

        rerender({ data: [{ id: '9', title: 'Durian', active: true }] });
        expect(result.current).toEqual([{ value: '9', label: 'Durian' }]);
    });
});
