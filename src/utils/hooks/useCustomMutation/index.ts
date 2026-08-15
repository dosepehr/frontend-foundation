import {
    useMutation,
    useQueryClient,
    type MutationKey,
    type UseMutationOptions,
    type UseMutationResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ApiError } from '../../api/types/DTO/http-errors.interface';

/**
 * UseCustomMutationOptions - options for useCustomMutation hook
 * @template V - type of variables/input
 * @template T - type of mutation result
 * @template E - type of error (defaults to ApiError)
 */
interface UseCustomMutationOptions<V, T, E = ApiError> extends Omit<
    UseMutationOptions<T, E, V>,
    'mutationFn' | 'mutationKey'
> {
    /**
     * mutationKey - identifies this mutation so it can be queued while
     * offline and resumed later. Required (rather than react-query's usual
     * optional key) because `ReactQueryProvider` persists paused mutations
     * to localStorage: a `mutationFn` can't survive serialization, so on
     * restore react-query looks it back up via `queryClient.getMutationDefaults(mutationKey)`
     * — which this hook registers below. Without a stable key, a mutation
     * queued offline and resumed after a reload has no function to run.
     */
    mutationKey: MutationKey;

    /**
     * mutationFn - the function that performs the mutation
     * @param variables - the input data for the mutation
     * @returns a Promise resolving to the mutation result
     */
    mutationFn: (variables: V) => Promise<T>;
}

/**
 * useCustomMutation - a reusable React Query mutation hook
 * @template V - type of variables/input
 * @template T - type of mutation result
 * @template E - type of error (defaults to ApiError)
 * @param options - configuration options for the mutation
 * @returns React Query's UseMutationResult with types T, E, V
 *
 * @example
 * const { mutate, isLoading, error } = useCustomMutation({
 *   mutationKey: ['createComment'],
 *   mutationFn: async (data: MyDTO) => {
 *     const response = await api.post('/endpoint', data);
 *     return response.data;
 *   },
 *   onSuccess: () => console.log('Mutation successful!'),
 * });
 */
const useCustomMutation = <V, T, E = ApiError>({
    mutationKey,
    mutationFn,
    ...otherConfig
}: UseCustomMutationOptions<V, T, E>): UseMutationResult<T, E, V> => {
    const queryClient = useQueryClient();

    // Registered as a mutation default (not just passed to useMutation) so
    // that a mutation queued while offline can find its mutationFn again
    // after being restored from localStorage on a later page load — see the
    // mutationKey doc above.
    useEffect(() => {
        queryClient.setMutationDefaults(mutationKey, { mutationFn });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryClient, JSON.stringify(mutationKey), mutationFn]);

    return useMutation<T, E, V>({
        mutationKey,
        mutationFn,
        ...otherConfig,
    });
};

export default useCustomMutation;
