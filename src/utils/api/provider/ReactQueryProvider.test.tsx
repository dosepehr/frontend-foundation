import { useMutation, useQuery } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import ReactQueryProvider from './ReactQueryProvider';

vi.mock('@sentry/nextjs', () => ({
    captureException: vi.fn(),
}));

function FailingQuery() {
    useQuery({
        queryKey: ['test-error-query'],
        queryFn: () => Promise.reject(new Error('boom')),
        retry: false,
    });
    return null;
}

function FailingMutationTrigger() {
    const mutation = useMutation({
        mutationFn: () => Promise.reject(new Error('mutation boom')),
    });
    return (
        <button type="button" onClick={() => mutation.mutate()}>
            trigger
        </button>
    );
}

describe('ReactQueryProvider', () => {
    it('renders children', async () => {
        render(
            <ReactQueryProvider>
                <div>child</div>
            </ReactQueryProvider>,
        );

        expect(screen.getByText('child')).toBeInTheDocument();

        // Flush PersistQueryClientProvider's async cache-restore effect so
        // its state update doesn't land after the test exits unact()'d.
        await act(async () => {});
    });

    it('reports query errors to Sentry via the queryCache onError handler', async () => {
        const Sentry = await import('@sentry/nextjs');
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(
            <ReactQueryProvider>
                <FailingQuery />
            </ReactQueryProvider>,
        );

        await waitFor(() =>
            expect(Sentry.captureException).toHaveBeenCalledWith(
                expect.any(Error),
            ),
        );

        consoleError.mockRestore();
    });

    it('reports mutation errors to Sentry via the mutationCache onError handler', async () => {
        const Sentry = await import('@sentry/nextjs');
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const { getByRole } = render(
            <ReactQueryProvider>
                <FailingMutationTrigger />
            </ReactQueryProvider>,
        );

        getByRole('button').click();

        await waitFor(() =>
            expect(Sentry.captureException).toHaveBeenCalledWith(
                expect.any(Error),
            ),
        );

        consoleError.mockRestore();
    });
});
