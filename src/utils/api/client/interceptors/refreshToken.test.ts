import type * as AxiosModule from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupRefreshToken } from './refreshToken';

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal<typeof AxiosModule>();
    return {
        ...actual,
        default: { ...actual.default, post: vi.fn() },
    };
});

type RejectedHandler = (error: AxiosError) => Promise<unknown>;

function createFakeClient() {
    const call = vi.fn().mockResolvedValue('retried-response');
    const ref: { handler?: RejectedHandler } = {};
    const client = Object.assign(call, {
        interceptors: {
            response: {
                use: (_fulfilled: unknown, rejected: RejectedHandler) => {
                    ref.handler = rejected;
                },
            },
        },
    }) as unknown as AxiosInstance;
    return { client, call, ref };
}

function makeError({
    status = 401,
    url = '/users/me',
    retry = false,
}: { status?: number; url?: string; retry?: boolean } = {}): AxiosError {
    return {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed',
        config: { url, headers: {}, _retry: retry },
        response: { status },
        toJSON: () => ({}),
    } as unknown as AxiosError;
}

function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/`;
}

function clearCookies() {
    document.cookie =
        'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie =
        'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

describe('setupRefreshToken', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        clearCookies();
        vi.mocked(axios.post).mockReset();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, href: '' },
        });
    });

    afterEach(() => {
        clearCookies();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('passes through non-401 errors without attempting a refresh', async () => {
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError({ status: 500 });

        await expect(ref.handler?.(error)).rejects.toBe(error);
        expect(axios.post).not.toHaveBeenCalled();
        expect(call).not.toHaveBeenCalled();
    });

    it('passes through 401s from auth endpoints without looping', async () => {
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError({ status: 401, url: '/auth/refresh' });

        await expect(ref.handler?.(error)).rejects.toBe(error);
        expect(axios.post).not.toHaveBeenCalled();
        expect(call).not.toHaveBeenCalled();
    });

    it('passes through 401s already marked as retried, instead of looping forever', async () => {
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError({ status: 401, retry: true });

        await expect(ref.handler?.(error)).rejects.toBe(error);
        expect(axios.post).not.toHaveBeenCalled();
        expect(call).not.toHaveBeenCalled();
    });

    it('redirects to /auth without calling the refresh endpoint when there is no refresh-token cookie', async () => {
        setCookie('access-token', 'stale-access-token');
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError();

        await expect(ref.handler?.(error)).rejects.toBe(error);

        expect(axios.post).not.toHaveBeenCalled();
        expect(call).not.toHaveBeenCalled();
        expect(window.location.href).toBe('/auth');
        expect(document.cookie).not.toContain('access-token');
    });

    it('refreshes the access token and retries the original request on success', async () => {
        setCookie('refresh-token', 'valid-refresh-token');
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
            },
        });
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError();
        const originalRequest = error.config as unknown as {
            headers: { Authorization?: string };
        };

        await expect(ref.handler?.(error)).resolves.toBe('retried-response');

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/refresh'),
            { refreshToken: 'valid-refresh-token' },
        );
        expect(document.cookie).toContain('access-token=new-access-token');
        expect(document.cookie).toContain('refresh-token=new-refresh-token');
        expect(originalRequest.headers.Authorization).toBe(
            'Bearer new-access-token',
        );
        expect(call).toHaveBeenCalledWith(error.config);
        expect(window.location.href).toBe('');
    });

    it('redirects to /auth when the refresh response has no access token', async () => {
        setCookie('refresh-token', 'valid-refresh-token');
        setCookie('access-token', 'stale-access-token');
        vi.mocked(axios.post).mockResolvedValue({ data: {} });
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError();

        await expect(ref.handler?.(error)).rejects.toBe(error);

        expect(window.location.href).toBe('/auth');
        expect(document.cookie).not.toContain('access-token');
        expect(call).not.toHaveBeenCalled();
    });

    it('redirects to /auth when the refresh call itself fails', async () => {
        setCookie('refresh-token', 'valid-refresh-token');
        setCookie('access-token', 'stale-access-token');
        const refreshError = new Error('refresh failed');
        vi.mocked(axios.post).mockRejectedValue(refreshError);
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const error = makeError();

        await expect(ref.handler?.(error)).rejects.toBe(refreshError);

        expect(window.location.href).toBe('/auth');
        expect(document.cookie).not.toContain('access-token');
        expect(call).not.toHaveBeenCalled();
    });

    it('queues concurrent 401s while a refresh is in flight and retries all of them once it succeeds', async () => {
        setCookie('refresh-token', 'valid-refresh-token');
        let resolvePost!: (value: { data: { accessToken: string } }) => void;
        vi.mocked(axios.post).mockReturnValue(
            new Promise((resolve) => {
                resolvePost = resolve;
            }) as never,
        );
        const { client, call, ref } = createFakeClient();
        setupRefreshToken(client);
        const handler = ref.handler as RejectedHandler;

        const firstError = makeError({ url: '/orders' });
        const secondError = makeError({ url: '/profile' });

        const firstCall = handler(firstError);
        const secondCall = handler(secondError);

        // The second 401 arrives while a refresh is already in flight, so it
        // should queue behind the first instead of triggering its own
        // refresh request.
        expect(axios.post).toHaveBeenCalledTimes(1);

        resolvePost({ data: { accessToken: 'new-access-token' } });

        await expect(firstCall).resolves.toBe('retried-response');
        await expect(secondCall).resolves.toBe('retried-response');
        expect(call).toHaveBeenCalledTimes(2);
    });
});
