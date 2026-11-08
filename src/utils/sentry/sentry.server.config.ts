import { env } from '@/utils/env';
import * as Sentry from '@sentry/nextjs';
import { scrubPii } from './scrubPii';

Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    beforeSend: scrubPii,
    tracesSampleRate: 1.0,
});
