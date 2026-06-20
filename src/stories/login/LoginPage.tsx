'use client';

import Button from '@/src/components/ui/Button';
import { InputComponent as Input } from '@/src/components/ui/Input/components';
import { PasswordInput } from '@/src/components/ui/PasswordInput/components';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function LoginPage() {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        setError('');

        const form = new FormData(e.currentTarget);

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.get('email'),
                    password: form.get('password'),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setError(data.message ?? 'Login failed.');
                return;
            }

            setStatus('success');
        } catch {
            setStatus('error');
            setError('Network error. Please try again.');
        }
    }

    if (status === 'success') {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <p className="text-sm text-green-600">Logged in successfully.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={status === 'loading'}
                        loadingText="Signing in..."
                    >
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}
