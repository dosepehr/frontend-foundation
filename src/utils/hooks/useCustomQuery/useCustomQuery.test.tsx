import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import useCustomQuery from '.';

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return function Wrapper({ children }: PropsWithChildren) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

describe('useCustomQuery', () => {
    it('resolves the data returned by queryFn', async () => {
        const queryFn = vi.fn(async () => ({ id: 1, name: 'Ada' }));

        const { result } = renderHook(
            () => useCustomQuery({ queryKey: ['user', 1], queryFn }),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ id: 1, name: 'Ada' });
        expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('exposes a rejected queryFn as the query error', async () => {
        const error = { status: false, message: 'Boom', type: 'NotFound' };
        const queryFn = vi.fn(async () => {
            throw error;
        });

        const { result } = renderHook(
            () => useCustomQuery({ queryKey: ['missing'], queryFn }),
            { wrapper: createWrapper() },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBe(error);
    });

    it('forwards extra query options such as enabled', () => {
        const queryFn = vi.fn(async () => 'never');

        const { result } = renderHook(
            () =>
                useCustomQuery({
                    queryKey: ['disabled'],
                    queryFn,
                    enabled: false,
                }),
            { wrapper: createWrapper() },
        );

        expect(result.current.fetchStatus).toBe('idle');
        expect(queryFn).not.toHaveBeenCalled();
    });
});
