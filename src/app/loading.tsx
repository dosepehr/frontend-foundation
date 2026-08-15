import Skeleton from '../components/ui/Skeleton';

/**
 * Default Suspense fallback for every route under `src/app` that doesn't
 * define its own `loading.tsx`. Pairs with `useCustomSuspenseQuery` — a
 * `useSuspenseQuery` call on first visit suspends into this boundary instead
 * of rendering nothing, while React Query's cache makes revisits instant.
 * Add a route-local `loading.tsx` to override this for a specific segment.
 */
export default function Loading() {
    return (
        <div className="flex min-h-svh flex-col gap-4 p-6">
            <Skeleton className="h-6 w-48" />
            <div className="flex max-w-md flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-32 w-full max-w-lg rounded-lg" />
        </div>
    );
}
