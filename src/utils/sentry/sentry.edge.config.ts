import * as Sentry from '@sentry/nextjs';
import { env } from '../env/env';

// Covers the edge runtime: middleware and routes with `export const runtime = 'edge'`.
Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
});
