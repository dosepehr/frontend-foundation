'use client';

import Button from '@/components/ui/Button';
import EmptyWrapper from '@/components/ui/Empty';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <EmptyWrapper
                icon={<AlertTriangle />}
                title="Something went wrong"
                description="An unexpected error occurred while loading this page. You can try again or head back home."
                action={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={reset}>
                            Try again
                        </Button>
                        <Button asChild>
                            <Link href="/">Go home</Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
