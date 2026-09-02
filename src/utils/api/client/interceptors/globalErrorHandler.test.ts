import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { mapErrorToToast } from '../mapErrorToToast';
import { globalErrorHandler } from './globalErrorHandler';

vi.mock('../mapErrorToToast', () => ({ mapErrorToToast: vi.fn() }));

type FulfilledHandler = (response: AxiosResponse) => AxiosResponse;
type RejectedHandler = (error: AxiosError) => Promise<unknown>;

function createFakeClient() {
    const ref: { fulfilled?: FulfilledHandler; rejected?: RejectedHandler } =
        {};
    const client = {
        interceptors: {
            response: {
                use: (
                    fulfilled: FulfilledHandler,
                    rejected: RejectedHandler,
                ) => {
                    ref.fulfilled = fulfilled;
                    ref.rejected = rejected;
                },
            },
        },
    } as unknown as AxiosInstance;
    return { client, ref };
}

describe('globalErrorHandler', () => {
    it('returns the response unchanged on success', () => {
        const { client, ref } = createFakeClient();
        globalErrorHandler(client);

        const response = { data: 'ok' } as unknown as AxiosResponse;

        expect(ref.fulfilled?.(response)).toBe(response);
    });

    it('maps the error to a toast and rejects with the same error', async () => {
        const { client, ref } = createFakeClient();
        globalErrorHandler(client);

        const error = { message: 'boom' } as unknown as AxiosError;

        await expect(ref.rejected?.(error)).rejects.toBe(error);
        expect(mapErrorToToast).toHaveBeenCalledWith(error);
    });
});
