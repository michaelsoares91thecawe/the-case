'use client';

import { Wine, LogOut } from 'lucide-react';
// import { signOut } from '@/auth'; // signOut is server side, need client way or form
import { signOut } from 'next-auth/react'; // Need client side signout 

// We can't import signOut from next-auth/react in a simple way if we are using server actions solely?
// Actually simpler to just have a form that calls a server action to sign out.
// But for now let's make a simple UI.

export default function PendingPage() {
    return (
        <main className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 text-center p-8">
                <div className="w-20 h-20 bg-wine-50 dark:bg-wine-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wine className="w-10 h-10 text-wine-900 dark:text-wine-400" />
                </div>

                <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-3">
                    Compte en attente
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                    Votre demande d'inscription est en cours d'examen par nos administrateurs. Vous recevrez l'accès dès que votre compte sera validé.
                </p>

                <div className="flex flex-col gap-3">
                    <a href="mailto:admin@thecawe.com" className="w-full py-3 bg-wine-900 hover:bg-wine-800 text-white rounded-xl font-bold transition-colors">
                        Contacter le support
                    </a>
                    {/* Sign out button ideally here */}
                </div>
            </div>
        </main>
    );
}
