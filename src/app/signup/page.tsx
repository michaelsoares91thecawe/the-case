'use client';

import { useActionState } from 'react';
import { registerUser } from '@/lib/actions';
import { Wine, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const initialState: { message: string; success?: boolean } = {
    message: '',
};

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(registerUser, initialState);

    return (
        <main className="flex min-h-screen">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Wine className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-white mb-6">Rejoignez The Cawe</h2>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                        Gérez votre cave d'exception, suivez la valeur de vos investissements et accédez à une communauté exclusive d'amateurs.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-zinc-950 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-wine-900 mb-8 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-180" /> Retour à l'accueil
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2">Créer un compte</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Entrez vos informations pour demander l'accès.</p>
                    </div>

                    {state?.success ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                            <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Demande envoyée !</h3>
                            <p className="text-green-700 dark:text-green-300 mb-6">
                                Votre inscription a bien été enregistrée. Un administrateur doit valider votre compte avant que vous puissiez vous connecter.
                            </p>
                            <Link href="/login" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nom complet</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Jean Dupont"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-wine-900/20 focus:border-wine-900 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="jean@exemple.com"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-wine-900/20 focus:border-wine-900 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mot de passe</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-wine-900/20 focus:border-wine-900 transition-all outline-none"
                                />
                            </div>

                            {state?.message && !state.success && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {state.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-wine-900 hover:bg-wine-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-wine-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "S'inscrire"}
                            </button>

                            <p className="text-center text-zinc-500 text-sm">
                                Déjà un compte ?{' '}
                                <Link href="/login" className="text-wine-900 font-bold hover:underline">
                                    Se connecter
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
