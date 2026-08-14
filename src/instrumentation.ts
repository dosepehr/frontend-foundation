import * as Sentry from '@sentry/nextjs';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./utils/sentry/sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('./utils/sentry/sentry.edge.config');
    }
}

// Captures errors thrown in nested React Server Components and Server
// Actions, which never reach `app/error.tsx`.
export const onRequestError = Sentry.captureRequestError;
