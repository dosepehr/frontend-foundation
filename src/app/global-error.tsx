'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import './globals.css';

// Only renders when the root layout itself throws. Next.js requires this
// file to render its own <html>/<body> since it replaces the whole layout,
// so it deliberately avoids providers, UI components, or anything else that
// could be the thing that crashed.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
                    <h1 className="text-lg font-medium text-foreground">
                        Something went wrong
                    </h1>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        The app hit an unexpected error. Try reloading the page.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
