'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Wine,
    ShoppingCart,
    Search,
    User,
    LogOut,
    PlusCircle,
    Mail,
    ShieldAlert
} from 'lucide-react';
import { logOut } from '@/lib/actions';

const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Cellar', href: '/dashboard/cellar', icon: Wine },
    { name: 'Add Wine', href: '/dashboard/add', icon: PlusCircle },
    { name: 'The Cawe', href: '/dashboard/marketplace', icon: Search },
    { name: 'Messages', href: '/dashboard/messages', icon: Mail },
    { name: 'Finance', href: '/dashboard/finance', icon: ShoppingCart },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Admin', href: '/dashboard/admin', icon: ShieldAlert },
];

export default function SideNav({ userRole, unreadCount = 0 }: { userRole?: string, unreadCount?: number }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col bg-[#1a1c23] border-r border-white/5 md:w-64">
            <Link
                className="flex items-center px-6 py-8"
                href="/"
            >
                <div className="bg-wine-900 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    <Wine className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold font-serif text-white tracking-wide">The Cawe</h1>
            </Link>

            <div className="flex flex-col flex-grow px-4 space-y-1">
                {links.map((link) => {
                    if (link.name === 'Admin' && userRole !== 'ADMIN') return null;

                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                                {
                                    'bg-wine-900/10 text-wine-400': isActive,
                                    'text-gray-400 hover:text-white hover:bg-white/5': !isActive,
                                },
                            )}
                        >
                            <div className="relative flex items-center gap-3">
                                <LinkIcon className={clsx("w-5 h-5 transition-colors", {
                                    'text-wine-500': isActive,
                                    'text-gray-500 group-hover:text-white': !isActive
                                })} />
                                <span>{link.name}</span>
                                {link.name === 'Messages' && unreadCount > 0 && (
                                    <span className="absolute -right-2 top-0 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/5">
                <button
                    type="button"
                    onClick={async () => {
                        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
                            await logOut();
                        }
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <div>Se déconnecter</div>
                </button>
            </div>
        </div>
    );
}
