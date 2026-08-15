import * as Sentry from '@sentry/nextjs';
import { env } from './utils/env/env';
import { scrubPii } from './utils/sentry/scrubPii';

// Loaded automatically by Next.js before the app boots in the browser.
// Also captures unhandled errors and unhandled promise rejections globally.
Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    beforeSend: scrubPii,
    // Traces a fraction of transactions to surface Core Web Vitals and slow
    // page loads/navigations. 1.0 = every transaction; dial down once real
    // traffic volume makes that too costly.
    tracesSampleRate: 1.0,
});

// Required by the SDK to attach breadcrumbs/spans to client-side route changes.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
