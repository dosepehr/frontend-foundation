import {
    useSuspenseQuery,
    type QueryKey,
    type UseSuspenseQueryOptions,
    type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '../../api/types/DTO/http-errors.interface';

/**
 * UseCustomSuspenseQueryOptions - options for useCustomSuspenseQuery hook
 * @template T - type of the data returned by the query
 * @template E - type of error (defaults to ApiError)
 */
interface UseCustomSuspenseQueryOptions<T, E = ApiError> extends Omit<
    UseSuspenseQueryOptions<T, E, T>,
    'queryKey' | 'queryFn'
> {
    /**
     * queryKey - a unique key to identify the query
     */
    queryKey: QueryKey;

    /**
     * queryFn - the function that fetches the data
     * @returns a Promise resolving to the query data
     */
    queryFn: () => Promise<T>;
}

/**
 * useCustomSuspenseQuery - a reusable React Query hook for fetching data via
 * Suspense. Unlike `useCustomQuery`, this never returns a loading state —
 * it suspends the component into the nearest `loading.tsx` (or `<Suspense>`)
 * boundary on first fetch, and throws into the nearest error boundary on
 * failure, so callers only ever see the resolved `data`.
 * @template T - type of the data returned by the query
 * @template E - type of error (defaults to ApiError)
 * @param options - configuration options for the query
 * @returns React Query's UseSuspenseQueryResult with types T and E
 *
 * @example
 * const { data } = useCustomSuspenseQuery({
 *   queryKey: ['user', userId],
 *   queryFn: async () => {
 *     const response = await api.get(`/users/${userId}`);
 *     return response.data;
 *   },
 * });
 */
const useCustomSuspenseQuery = <T, E = ApiError>({
    queryKey,
    queryFn,
    ...otherConfig
}: UseCustomSuspenseQueryOptions<T, E>): UseSuspenseQueryResult<T, E> =>
    useSuspenseQuery<T, E, T>({
        queryKey,
        queryFn,
        ...otherConfig,
    });

export default useCustomSuspenseQuery;
