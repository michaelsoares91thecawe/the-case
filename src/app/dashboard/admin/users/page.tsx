import { User, Shield, Check, X, Mail, Trash2, UserCog, UserCheck } from 'lucide-react';
import { approveUser, rejectUser, inviteUser, deleteUser, updateUserRole } from '@/lib/actions';
import prisma from '@/lib/prisma';

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
        <div className="max-w-7xl mx-auto p-6">
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (1/3): Invite & Pending */}
                <div className="space-y-8 xl:col-span-1">
                    {/* Invite Form */}
                    <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-wine-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <Mail className="w-5 h-5 text-wine-400" />
                            Inviter un utilisateur
                        </h2>
                        <form action={async (formData) => {
                            'use server';
                            await inviteUser(
                                formData.get('email') as string,
                                formData.get('name') as string,
                                formData.get('role') as string
                            );
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
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Rôle</label>
                                <select name="role" className="w-full bg-zinc-800 border-none rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-wine-500 text-white appearance-none cursor-pointer">
                                    <option value="USER">Utilisateur (Classique)</option>
                                    <option value="ADMIN">Administrateur (Accès complet)</option>
                                </select>
                            </div>
                            <button className="w-full py-3 bg-wine-600 hover:bg-wine-500 rounded-lg font-bold transition-colors">
                                Envoyer l'invitation
                            </button>
                        </form>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${pendingUsers.length > 0 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                Demandes en attente
                            </h2>
                            {pendingUsers.length > 0 && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                                    {pendingUsers.length}
                                </span>
                            )}
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <User className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p>Aucune demande.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user: any) => (
                                    <div key={user.id} className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                        <div className="mb-3">
                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                'use server';
                                                await approveUser(user.id);
                                            }} className="flex-1">
                                                <button className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                                                    <Check className="w-4 h-4" /> Accepter
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server';
                                                await rejectUser(user.id);
                                            }} className="flex-1">
                                                <button className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                                                    <X className="w-4 h-4" /> Refuser
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (2/3): Users Table */}
                <div className="xl:col-span-2">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Utilisateurs Actifs</h2>
                            <span className="text-sm text-gray-500">{existingUsers.length} utilisateurs</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-zinc-950/50 text-xs uppercase text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Rôle</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {existingUsers.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}>
                                                    {user.role === 'ADMIN' ? <UserCheck className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                                        user.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle Role Button */}
                                                    <form action={async () => {
                                                        'use server';
                                                        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
                                                        await updateUserRole(user.id, newRole);
                                                    }}>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title={user.role === 'ADMIN' ? "Rétrograder Utilisateur" : "Promouvoir Admin"}
                                                        >
                                                            <UserCog className="w-5 h-5" />
                                                        </button>
                                                    </form>

                                                    {/* Delete Button */}
                                                    <form action={async () => {
                                                        'use server';
                                                        await deleteUser(user.id);
                                                    }}>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Supprimer définitivement"
                                                        // Add confirm dialog in a real client component, for server action we click direct
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
