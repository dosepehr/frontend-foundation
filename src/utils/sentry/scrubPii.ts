import type { ErrorEvent, EventHint } from '@sentry/nextjs';

// Headers/cookies that can carry auth material or other PII. Sentry's
// `sendDefaultPii` defaults to false, but request headers/cookies still ride
// along on captured requests unless explicitly stripped here.
const SENSITIVE_HEADER_NAMES = new Set([
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'proxy-authorization',
]);

const SENSITIVE_USER_FIELDS = ['ip_address', 'email', 'username'] as const;

function scrubHeaders(headers: Record<string, string> | undefined) {
    if (!headers) return headers;
    for (const key of Object.keys(headers)) {
        if (SENSITIVE_HEADER_NAMES.has(key.toLowerCase())) {
            delete headers[key];
        }
    }
    return headers;
}

// Strips auth cookies/headers and identifying user fields from every event
// before it leaves the browser/server. Wired into all three Sentry.init
// calls (client, server, edge) so no runtime can skip it.
export function scrubPii(event: ErrorEvent, _hint: EventHint): ErrorEvent {
    if (event.request) {
        delete event.request.cookies;
        event.request.headers = scrubHeaders(event.request.headers);
    }

    if (event.user) {
        for (const field of SENSITIVE_USER_FIELDS) {
            delete event.user[field];
        }
    }

    for (const exception of event.exception?.values ?? []) {
        for (const frame of exception.stacktrace?.frames ?? []) {
            delete frame.vars;
        }
    }

    return event;
}
