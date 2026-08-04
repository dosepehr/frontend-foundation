import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Offline',
};

export default function OfflinePage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
            <h1 className="text-lg font-medium">You&apos;re offline</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
                This page isn&apos;t available without a connection. Check your
                network and try again — cached pages will keep working.
            </p>
        </div>
    );
}
