import * as Sentry from '@sentry/nextjs';
import { env } from '../env/env';
import { scrubPii } from './scrubPii';

// Covers the edge runtime: middleware and routes with `export const runtime = 'edge'`.
Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    beforeSend: scrubPii,
    tracesSampleRate: 1.0,
});
