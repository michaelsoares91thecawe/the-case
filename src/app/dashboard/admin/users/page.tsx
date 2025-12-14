import prisma from '@/lib/prisma';
import { User, Shield, Check, X, Mail } from 'lucide-react';
import { approveUser, rejectUser, inviteUser } from '@/lib/actions';

export const dynamic = 'force-dynamic';

async function getUsers() {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminUsersPage() {
    const users = await getUsers();
    const pendingUsers = users.filter((u: any) => u.status === 'PENDING');
    const existingUsers = users.filter((u: any) => u.status !== 'PENDING');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-wine-900 rounded-xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                        Administration
                    </h1>
                </div>
                <p className="text-gray-500 text-lg">Gérez les accès et les utilisateurs de la plateforme.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Pending Requests */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                Demandes en attente
                            </h2>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                                {pendingUsers.length}
                            </span>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Aucune demande en attente.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Inscrit le {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                'use server';
                                                await rejectUser(user.id);
                                            }}>
                                                <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Refuser">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await approveUser(user.id);
                                            }}>
                                                <button className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors" title="Accepter">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Invite & Active Users */}
                <div className="space-y-6">
                    {/* Invite Form */}
                    <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-wine-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <Mail className="w-5 h-5 text-wine-400" />
                            Inviter un utilisateur
                        </h2>
                        <form action={async (formData) => {
                            'use server';
                            await inviteUser(formData.get('email') as string, formData.get('name') as string);
                        }} className="space-y-4 relative z-10">
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</label>
                                <input name="name" type="text" placeholder="Nom complet" required
                                    className="w-full bg-zinc-800 border-none rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-wine-500" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                                <input name="email" type="email" placeholder="email@exemple.com" required
                                    className="w-full bg-zinc-800 border-none rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-wine-500" />
                            </div>
                            <button className="w-full py-3 bg-wine-600 hover:bg-wine-500 rounded-lg font-bold transition-colors">
                                Envoyer l'invitation
                            </button>
                        </form>
                    </div>

                    {/* Active Users List (Compact) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                        <h2 className="text-lg font-bold mb-4">Utilisateurs Actifs</h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {existingUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.role}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${user.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        user.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.status || 'Active'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
