describe('env', () => {
    const originalVitest = process.env.VITEST;

    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        process.env.VITEST = originalVitest;
    });

    it('bypasses validation under Vitest, passing values through unvalidated', async () => {
        vi.stubEnv('NEXT_PUBLIC_APP_BASE_URL', 'not-a-url');

        const { env } = await import('./env');

        expect(env.NEXT_PUBLIC_APP_BASE_URL).toBe('not-a-url');
    });

    it('validates and throws when the Vitest bypass is off and the client env is invalid', async () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        vi.stubEnv('NEXT_PUBLIC_APP_BASE_URL', 'not-a-url');
        delete process.env.VITEST;

        await expect(import('./env')).rejects.toThrow(
            'Invalid client environment variables, see console output above',
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '❌ Invalid client environment variables:',
            expect.anything(),
        );
    });

    it('validates and succeeds when the Vitest bypass is off and the client env is valid', async () => {
        vi.stubEnv('NEXT_PUBLIC_APP_BASE_URL', 'https://example.com');
        delete process.env.VITEST;

        const { env } = await import('./env');

        expect(env.NEXT_PUBLIC_APP_BASE_URL).toBe('https://example.com');
    });

    it('throws when accessing a server-only variable from the client', async () => {
        const { env } = await import('./env');

        expect(
            () => (env as unknown as Record<string, unknown>).BACKEND_URL,
        ).toThrow(
            '❌ Attempted to access server-side environment variable "BACKEND_URL" on the client',
        );
    });

    it('allows accessing a client variable normally', async () => {
        const { env } = await import('./env');

        expect(() => env.NEXT_PUBLIC_APP_BASE_URL).not.toThrow();
    });
});
