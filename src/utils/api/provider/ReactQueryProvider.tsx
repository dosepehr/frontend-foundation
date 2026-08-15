'use client';

import * as Sentry from '@sentry/nextjs';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { FC, PropsWithChildren } from 'react';
import { OfflineMutationSync } from '../../../components/Providers/OfflineMutationSync/OfflineMutationSync';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            console.error('[QueryCache]', error);
            Sentry.captureException(error);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            console.error('[MutationCache]', error);
            Sentry.captureException(error);
        },
    }),
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            throwOnError: false,
            gcTime: 1000 * 60 * 60 * 24, // 24h — inactive cache is garbage-collected after this
            staleTime: 1000 * 60 * 60 * 5, // 5h  — data is re-fetched after this
        },
    },
});

// Queues mutations made while offline in localStorage and replays them on
// reconnect, even across a reload. Only *paused* mutations are persisted —
// the query cache itself is left alone since reads are already served
// offline by the service worker's cache (see public/sw.js).
const persister = createAsyncStoragePersister({
    storage: typeof window === 'undefined' ? undefined : window.localStorage,
    key: 'ff-offline-mutation-queue',
});

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => (
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
            persister,
            maxAge: 1000 * 60 * 60 * 24, // 24h — matches queries.gcTime above
            dehydrateOptions: {
                shouldDehydrateQuery: () => false,
                shouldDehydrateMutation: (mutation) => mutation.state.isPaused,
            },
        }}
        // Fires once the persisted cache has been restored — replay any
        // mutations that were queued before the last reload/close. A no-op
        // if the device is still offline (they just stay paused).
        onSuccess={() => queryClient.resumePausedMutations()}
    >
        {children}
        <OfflineMutationSync />
        <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
);

export default ReactQueryProvider;
