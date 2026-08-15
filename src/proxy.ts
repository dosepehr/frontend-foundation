import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Runs on every page request to attach a per-request CSP. `/sw.js` keeps its
// own narrower policy from `next.config.ts`'s `headers()`, and `/stories`
// (Storybook's static export) is excluded because it needs its own inline
// scripts that a nonce-scoped policy would block.
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|stories).*)'],
};

export function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    // Backend API origin — must be reachable from `connect-src` since axios
    // calls it directly from the browser (see `src/utils/env/env.ts`).
    const apiOrigin = process.env.NEXT_PUBLIC_APP_BASE_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_BASE_URL).origin
        : '';

    const csp = [
        `default-src 'self'`,
        // 'strict-dynamic' lets the nonce'd root script load the rest of the
        // app bundle; Next.js reads the nonce from this header and stamps it
        // onto the scripts it renders (framework bundle, RSC payload, etc).
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
        // Tailwind/Motion set inline `style` attributes at runtime, so a
        // nonce can't cover style-src the way it does script-src.
        `style-src 'self' 'unsafe-inline'`,
        `img-src 'self' blob: data: https://picsum.photos`,
        `font-src 'self'`,
        `connect-src 'self' https://*.sentry.io ${apiOrigin}`.trim(),
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors 'none'`,
        `upgrade-insecure-requests`,
    ].join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', csp);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', csp);

    return response;
}
