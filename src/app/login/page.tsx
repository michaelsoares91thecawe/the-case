'use client';

import { useActionState, Suspense } from 'react';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 text-black dark:text-white">
            <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
                <h1 className="text-2xl font-bold text-center mb-4">The Cawe</h1>

                <input type="hidden" name="redirectTo" value={callbackUrl} />

                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="demo@thecawe.com"
                        defaultValue="demo@thecawe.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="password123"
                        defaultValue="password123"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    aria-disabled={isPending}
                    disabled={isPending}
                >
                    {isPending ? 'Logging in...' : 'Log in'}
                </button>

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
