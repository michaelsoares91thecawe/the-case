import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { User, ShieldAlert, Wine } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminPage() {
    const session = await auth();

    if (session?.user?.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const userCount = await prisma.user.count();
    const wineCount = await prisma.wine.count();
    const cellarCount = await prisma.cellarItem.count();

    return (
        <div className="w-full space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-8 h-8 text-wine-900 dark:text-wine-400" />
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/admin/users" className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-wine-200 transition-colors group">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <User className="w-5 h-5 group-hover:text-wine-900 transition-colors" />
                        <span className="uppercase text-xs font-bold tracking-wider">Total Users</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{userCount}</div>
                </Link>

                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <Wine className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold tracking-wider">Wine Database</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{wineCount}</div>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <Wine className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold tracking-wider">Total Bottles Tracked</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{cellarCount}</div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1c23] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/dashboard/admin/users" className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        Manage Users
                    </Link>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors opacity-50 cursor-not-allowed">
                        Manage Wines (Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
