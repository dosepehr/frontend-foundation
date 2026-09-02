import type { ErrorEvent, EventHint } from '@sentry/nextjs';
import { scrubPii } from './scrubPii';

function makeHint(): EventHint {
    return {} as EventHint;
}

describe('scrubPii', () => {
    it('strips cookies and sensitive headers while keeping non-sensitive ones', () => {
        const event = {
            request: {
                cookies: { session: 'abc123' },
                headers: {
                    Authorization: 'Bearer secret',
                    cookie: 'foo=bar',
                    'set-cookie': 'foo=bar',
                    'x-api-key': 'key123',
                    'proxy-authorization': 'Basic abc',
                    'x-request-id': 'req-1',
                },
            },
        } as unknown as ErrorEvent;

        const result = scrubPii(event, makeHint());

        expect(result.request?.cookies).toBeUndefined();
        expect(result.request?.headers).toEqual({
            'x-request-id': 'req-1',
        });
    });

    it('strips sensitive user fields while keeping others', () => {
        const event = {
            user: {
                id: 'user-1',
                ip_address: '1.2.3.4',
                email: 'user@example.com',
                username: 'someone',
            },
        } as unknown as ErrorEvent;

        const result = scrubPii(event, makeHint());

        expect(result.user).toEqual({ id: 'user-1' });
    });

    it('strips .vars from every stack frame across all exceptions', () => {
        const event = {
            exception: {
                values: [
                    {
                        stacktrace: {
                            frames: [
                                {
                                    filename: 'a.ts',
                                    vars: { secret: 'value' },
                                },
                                {
                                    filename: 'b.ts',
                                    vars: { secret: 'value2' },
                                },
                            ],
                        },
                    },
                ],
            },
        } as unknown as ErrorEvent;

        const result = scrubPii(event, makeHint());

        const frames = result.exception?.values?.[0]?.stacktrace?.frames;
        expect(frames?.[0]).toEqual({ filename: 'a.ts' });
        expect(frames?.[1]).toEqual({ filename: 'b.ts' });
    });

    it('does not throw when request, user, and exception are all absent', () => {
        const event = {} as ErrorEvent;

        expect(() => scrubPii(event, makeHint())).not.toThrow();
        expect(scrubPii(event, makeHint())).toBe(event);
    });

    it('does not throw when request.headers is absent', () => {
        const event = {
            request: {
                cookies: { session: 'abc' },
            },
        } as unknown as ErrorEvent;

        expect(() => scrubPii(event, makeHint())).not.toThrow();
        expect(event.request?.headers).toBeUndefined();
    });
});
