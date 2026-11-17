import { act, renderHook } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { useQueryFilter } from '.';

function withUrl(search = '') {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const wrapper = ({ children }: { children: ReactNode }) => (
        <NuqsTestingAdapter searchParams={search} onUrlUpdate={onUrlUpdate}>
            {children}
        </NuqsTestingAdapter>
    );
    const lastQuery = () => onUrlUpdate.mock.calls.at(-1)?.[0].queryString;
    return { wrapper, lastQuery };
}

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

describe('useQueryFilter — reading', () => {
    it('reads each type from the URL', () => {
        const { wrapper } = withUrl(
            '?status=active&tags=a,b&name=ada&created=2026-01-05,2026-01-09&price=10,200',
        );
        const read = <T,>(hook: () => T) =>
            renderHook(hook, { wrapper }).result.current;

        expect(read(() => useQueryFilter('status', 'select')).value).toBe(
            'active',
        );
        expect(read(() => useQueryFilter('tags', 'multiselect')).value).toEqual(
            ['a', 'b'],
        );
        expect(read(() => useQueryFilter('name', 'text')).value).toBe('ada');
        expect(read(() => useQueryFilter('created', 'date')).value).toEqual({
            from: JAN_5,
            to: JAN_9,
        });
        expect(
            read(() => useQueryFilter('price', 'number-range')).value,
        ).toEqual({ from: 10, to: 200 });
    });

    it('is null without the param or with an invalid one', () => {
        const { wrapper } = withUrl('?created=nope');
        expect(
            renderHook(() => useQueryFilter('status', 'select'), { wrapper })
                .result.current.value,
        ).toBeNull();
        expect(
            renderHook(() => useQueryFilter('created', 'date'), { wrapper })
                .result.current.value,
        ).toBeNull();
    });
});

describe('useQueryFilter — writing', () => {
    it('writes values to the URL', async () => {
        const { wrapper, lastQuery } = withUrl();
        const { result } = renderHook(() => useQueryFilter('created', 'date'), {
            wrapper,
        });

        await act(async () =>
            result.current.onChange({ from: JAN_5, to: JAN_9 }),
        );

        await vi.waitFor(() =>
            expect(lastQuery()).toBe('?created=2026-01-05,2026-01-09'),
        );
        expect(result.current.value).toEqual({ from: JAN_5, to: JAN_9 });
    });

    it('writes lists and number ranges', async () => {
        const { wrapper, lastQuery } = withUrl();
        const tags = renderHook(() => useQueryFilter('tags', 'multiselect'), {
            wrapper,
        });
        await act(async () => tags.result.current.onChange(['a', 'b']));
        await vi.waitFor(() => expect(lastQuery()).toBe('?tags=a,b'));

        const price = renderHook(
            () => useQueryFilter('price', 'number-range'),
            { wrapper },
        );
        await act(async () => price.result.current.onChange({ to: 50 }));
        await vi.waitFor(() => expect(lastQuery()).toContain('price=,50'));
    });

    it('removes the param for null, empty text and empty lists', async () => {
        const { wrapper, lastQuery } = withUrl('?name=ada&tags=a');
        const name = renderHook(() => useQueryFilter('name', 'text'), {
            wrapper,
        });
        const tags = renderHook(() => useQueryFilter('tags', 'multiselect'), {
            wrapper,
        });

        await act(async () => name.result.current.onChange(''));
        await vi.waitFor(() => expect(lastQuery()).not.toContain('name='));

        await act(async () => tags.result.current.onChange([]));
        await vi.waitFor(() => expect(lastQuery()).not.toContain('tags='));

        await act(async () => name.result.current.onChange(null));
        expect(name.result.current.value).toBeNull();
    });

    it('passes nuqs options through', async () => {
        const { wrapper } = withUrl();
        const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
        const pushWrapper = ({ children }: { children: ReactNode }) => (
            <NuqsTestingAdapter onUrlUpdate={onUrlUpdate}>
                {children}
            </NuqsTestingAdapter>
        );
        const { result } = renderHook(
            () => useQueryFilter('status', 'select', { history: 'push' }),
            {
                wrapper: pushWrapper,
            },
        );

        await act(async () => result.current.onChange('active'));

        await vi.waitFor(() =>
            expect(onUrlUpdate.mock.calls.at(-1)?.[0].options.history).toBe(
                'push',
            ),
        );
        expect(wrapper).toBeDefined();
    });
});
