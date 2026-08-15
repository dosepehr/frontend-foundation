'use client';

import { onlineManager, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

const TOAST_ID = 'offline-mutation-queue';

/**
 * Surfaces the offline mutation queue set up in `ReactQueryProvider`: an
 * "offline" toast while disconnected, and a "back online" confirmation once
 * reconnecting flushes any mutations that were queued via `useCustomMutation`.
 *
 * Must render as a descendant of `ReactQueryProvider` — it reads the
 * `QueryClient` via `useQueryClient()`.
 */
export const OfflineMutationSync = () => {
    const queryClient = useQueryClient();

    useEffect(
        () =>
            onlineManager.subscribe((isOnline) => {
                if (!isOnline) {
                    toast('You’re offline', {
                        id: TOAST_ID,
                        description:
                            'Any changes you make will be queued and synced automatically once you’re back online.',
                        duration: Infinity,
                    });
                    return;
                }

                toast.dismiss(TOAST_ID);

                const queuedCount = queryClient
                    .getMutationCache()
                    .getAll()
                    .filter((mutation) => mutation.state.isPaused).length;

                if (queuedCount > 0) {
                    toast.success('Back online', {
                        description: `Syncing ${queuedCount} queued change${queuedCount > 1 ? 's' : ''}…`,
                    });
                }
            }),
        [queryClient],
    );

    return null;
};
