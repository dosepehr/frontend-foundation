import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import useCustomMutation from '.';

function createWrapper(queryClient: QueryClient) {
    return function Wrapper({ children }: PropsWithChildren) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

describe('useCustomMutation', () => {
    it('runs the mutation and resolves data as usual', async () => {
        const queryClient = new QueryClient();
        const mutationFn = vi.fn(async (name: string) => `hello ${name}`);

        const { result } = renderHook(
            () =>
                useCustomMutation({
                    mutationKey: ['greet'],
                    mutationFn,
                }),
            { wrapper: createWrapper(queryClient) },
        );

        result.current.mutate('world');

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBe('hello world');
        expect(mutationFn.mock.calls[0]?.[0]).toBe('world');
    });

    it('registers the mutationFn as a mutation default under mutationKey', () => {
        const queryClient = new QueryClient();
        const mutationFn = vi.fn(async () => 'ok');

        renderHook(
            () =>
                useCustomMutation({
                    mutationKey: ['createComment'],
                    mutationFn,
                }),
            { wrapper: createWrapper(queryClient) },
        );

        // This is what lets a mutation persisted while offline (see
        // ReactQueryProvider) find its function again after being restored
        // from storage on a later page load, since mutationFn itself can't
        // survive serialization.
        expect(
            queryClient.getMutationDefaults(['createComment']).mutationFn,
        ).toBe(mutationFn);
    });
});
