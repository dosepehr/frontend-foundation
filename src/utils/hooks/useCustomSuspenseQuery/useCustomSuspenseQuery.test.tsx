import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import useCustomSuspenseQuery from '.';

function Greeting({ queryFn }: { queryFn: () => Promise<string> }) {
    const { data } = useCustomSuspenseQuery({
        queryKey: ['greeting'],
        queryFn,
    });
    return <p>{data}</p>;
}

function renderWithClient(queryFn: () => Promise<string>) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<p>Loading…</p>}>
                <Greeting queryFn={queryFn} />
            </Suspense>
        </QueryClientProvider>,
    );
}

describe('useCustomSuspenseQuery', () => {
    it('suspends to the fallback, then renders the resolved data', async () => {
        const queryFn = vi.fn(async () => 'Hello');

        renderWithClient(queryFn);

        expect(screen.getByText('Loading…')).toBeInTheDocument();
        expect(await screen.findByText('Hello')).toBeInTheDocument();
        expect(queryFn).toHaveBeenCalledTimes(1);
    });
});
