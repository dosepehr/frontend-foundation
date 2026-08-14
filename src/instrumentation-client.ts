import * as Sentry from '@sentry/nextjs';
import { env } from './utils/env/env';

// Loaded automatically by Next.js before the app boots in the browser.
// Also captures unhandled errors and unhandled promise rejections globally.
Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
});

// Required by the SDK to attach breadcrumbs/spans to client-side route changes.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
