import { auth } from '@/auth';
import { BentoCard } from '@/components/ui/bento-card';
import prisma from '@/lib/prisma';
import { Camera, Plus, Wine, TrendingUp, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;

    // Fetch Stats
    const stats = await prisma.cellarItem.aggregate({
        where: { userId: user?.id },
        _sum: { quantity: true, buyPrice: true },
        _count: { wineId: true }
    });

    const totalBottles = stats._sum.quantity || 0;
    const totalWines = stats._count.wineId || 0;
    const estimatedValue = (stats._sum.buyPrice || 0) * 1.15; // Mock increase

    // Fetch Top Bottles for "My Cellar" preview (instead of list)
    const topBottles = await prisma.cellarItem.findMany({
        where: { userId: user?.id },
        take: 3,
        orderBy: { buyPrice: 'desc' },
        include: { wine: true }
    });

    return (
        <main className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name?.split(' ')[0] || 'Sommelier'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* 1. Actions - Prominent (Col 8) */}
                <div className="col-span-12 md:col-span-8 bg-wine-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Manage Your Collection</h2>
                            <p className="text-wine-100 mb-6">Add new bottles or scan labels to keep your digital cellar up to date.</p>
                            <div className="flex gap-4">
                                <Link href="/dashboard/add" className="inline-flex items-center gap-2 bg-white text-wine-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                    <Plus className="w-5 h-5" />
                                    Add Wine
                                </Link>
                                <button className="inline-flex items-center gap-2 bg-wine-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-wine-700 transition-colors">
                                    <Camera className="w-5 h-5" />
                                    Scan Label
                                </button>
                            </div>
                        </div>
                        {/* Decorative Icon */}
                        <div className="opacity-20 hidden md:block">
                            <Wine className="w-32 h-32" />
                        </div>
                    </div>
                </div>

                {/* 2. Quick Value (Col 4) */}
                <div className="col-span-12 md:col-span-4 bg-white dark:bg-[#1a1c23] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <CircleDollarSign className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-wider uppercase">Total Value</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                            €{estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg w-fit">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-bold">+15% est. appreciation</span>
                    </div>
                </div>

                {/* 3. My Cellar Summary (Col 12 - New Section) */}
                <div className="col-span-12 bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
                            <Wine className="w-6 h-6 text-wine-600" />
                            My Cellar Highlights
                        </h2>
                        <Link href="/dashboard/cellar" className="text-sm font-bold text-wine-900 dark:text-wine-400 hover:underline">View Full Cellar →</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/5">
                        <div className="text-center px-4">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{totalBottles}</div>
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Bottles</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{totalWines}</div>
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Unique References</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-5xl font-bold text-wine-600 mb-2">{Math.round(totalBottles / (totalWines || 1))}</div>
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Avg Bottle / Ref</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-5xl font-bold text-green-600 mb-2">3</div>
                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Ready to Drink</div>
                        </div>
                    </div>
                </div>

                {/* 3.5 Top Bottles Visual Preview (Optional, replacing 'Recently Added' with something visuals) */}
                <div className="col-span-12 md:col-span-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topBottles.map(item => (
                            <Link href={`/dashboard/cellar/${item.id}`} key={item.id} className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group">
                                <div className="relative w-16 h-20 bg-white dark:bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
                                    {item.wine.image ? (
                                        <Image src={item.wine.image} alt={item.wine.name} fill className="object-contain" />
                                    ) : (
                                        <Wine className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-wine-700 transition-colors line-clamp-1">{item.wine.name}</h3>
                                    <p className="text-sm text-gray-500">{item.wine.vintage} • {item.wine.region}</p>
                                    <div className="mt-1 text-xs font-bold text-wine-900 dark:text-wine-400">€{item.buyPrice}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 4. AI (Col 12) */}
                <div className="col-span-12 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-6 text-white flex items-center justify-between">
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-1">Sommelier AI</h3>
                        <p className="text-gray-300 text-sm">Based on your preferences, we recommend opening the <strong>Chateau Margaux 2015</strong> this weekend.</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                        Ask Advice
                    </button>
                </div>
            </div>
        </main>
    );
}
