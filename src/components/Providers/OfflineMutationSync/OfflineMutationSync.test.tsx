import {
    onlineManager,
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query';
import { act, render, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { OfflineMutationSync } from './OfflineMutationSync';

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), {
        dismiss: vi.fn(),
        success: vi.fn(),
    }),
}));

// A mutation that never resolves — used to keep it "pending" while we flip
// offline/online around it, mirroring a real request paused mid-flight.
function PendingMutationTrigger() {
    const mutation = useMutation({
        mutationKey: ['test-mutation'],
        mutationFn: () => new Promise<void>(() => {}),
    });
    return (
        <button type="button" onClick={() => mutation.mutate()}>
            trigger
        </button>
    );
}

describe('OfflineMutationSync', () => {
    afterEach(() => {
        onlineManager.setOnline(true);
        vi.clearAllMocks();
    });

    it('shows a persistent toast when the device goes offline', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <OfflineMutationSync />
            </QueryClientProvider>,
        );

        act(() => onlineManager.setOnline(false));

        expect(toast).toHaveBeenCalledWith(
            expect.stringContaining('offline'),
            expect.objectContaining({
                id: 'offline-mutation-queue',
                duration: Infinity,
            }),
        );
    });

    it('dismisses the offline toast and reports queued mutations on reconnect', async () => {
        const queryClient = new QueryClient();
        const { getByRole } = render(
            <QueryClientProvider client={queryClient}>
                <OfflineMutationSync />
                <PendingMutationTrigger />
            </QueryClientProvider>,
        );

        act(() => onlineManager.setOnline(false));
        getByRole('button').click();

        await waitFor(() =>
            expect(
                queryClient
                    .getMutationCache()
                    .getAll()
                    .some((mutation) => mutation.state.isPaused),
            ).toBe(true),
        );

        act(() => onlineManager.setOnline(true));

        expect(toast.dismiss).toHaveBeenCalledWith('offline-mutation-queue');
        expect(toast.success).toHaveBeenCalledWith(
            'Back online',
            expect.objectContaining({
                description: expect.stringContaining('1 queued change'),
            }),
        );
    });

    it('does not announce a sync when reconnecting with nothing queued', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <OfflineMutationSync />
            </QueryClientProvider>,
        );

        act(() => onlineManager.setOnline(false));
        act(() => onlineManager.setOnline(true));

        expect(toast.success).not.toHaveBeenCalled();
    });
});
