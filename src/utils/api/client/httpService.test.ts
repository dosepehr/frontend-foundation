import type { InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '../../env/env';
import { httpService } from './httpService';

vi.mock('./interceptors/refreshToken', () => ({
    setupRefreshToken: vi.fn(),
}));
vi.mock('./interceptors/globalErrorHandler', () => ({
    globalErrorHandler: vi.fn(),
}));

function clearCookies() {
    document.cookie =
        'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function makeConfig(
    overrides: Partial<InternalAxiosRequestConfig> = {},
): InternalAxiosRequestConfig {
    return {
        headers: {},
        ...overrides,
    } as InternalAxiosRequestConfig;
}

describe('httpService', () => {
    beforeEach(() => {
        clearCookies();
    });

    afterEach(() => {
        clearCookies();
    });

    it('uses the app base URL from env', () => {
        expect(httpService.defaults.baseURL).toBe(env.NEXT_PUBLIC_APP_BASE_URL);
    });

    describe('request interceptor', () => {
        const requestFulfilled = (
            httpService.interceptors.request as unknown as {
                handlers: Array<{
                    fulfilled: (
                        config: InternalAxiosRequestConfig,
                    ) => InternalAxiosRequestConfig;
                }>;
            }
        ).handlers[0]?.fulfilled;

        it('sets the Authorization header from the access-token cookie', () => {
            document.cookie = 'access-token=abc123; path=/';
            const config = makeConfig();

            const result = requestFulfilled?.(config);

            expect(result?.headers.Authorization).toBe('Bearer abc123');
        });

        it('does not set an Authorization header when there is no cookie', () => {
            const config = makeConfig();

            const result = requestFulfilled?.(config);

            expect(result?.headers.Authorization).toBeUndefined();
        });

        it('sets Content-Type to application/json for non-FormData bodies', () => {
            const config = makeConfig({ data: { foo: 'bar' } });

            const result = requestFulfilled?.(config);

            expect(result?.headers['Content-Type']).toBe('application/json');
        });

        it('does not force Content-Type to application/json for FormData bodies', () => {
            const config = makeConfig({ data: new FormData() });

            const result = requestFulfilled?.(config);

            expect(result?.headers['Content-Type']).toBeUndefined();
        });

        it('rejects with the same error on request setup failure', async () => {
            const requestRejected = (
                httpService.interceptors.request as unknown as {
                    handlers: Array<{
                        rejected: (error: unknown) => Promise<unknown>;
                    }>;
                }
            ).handlers[0]?.rejected;

            const error = new Error('request setup failed');

            await expect(requestRejected?.(error)).rejects.toBe(error);
        });
    });

    describe('response interceptor', () => {
        it('unwraps the response to its data payload', () => {
            const responseFulfilled = (
                httpService.interceptors.response as unknown as {
                    handlers: Array<{
                        fulfilled: (response: unknown) => unknown;
                    }>;
                }
            ).handlers[0]?.fulfilled;

            const response = { data: { id: 1 }, status: 200 };

            expect(responseFulfilled?.(response)).toBe(response.data);
        });
    });
});
