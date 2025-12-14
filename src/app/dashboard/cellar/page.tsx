import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, TrendingUp } from 'lucide-react';
import { WineCard } from '@/components/ui/wine-card';
import { FilterBar } from '@/components/ui/filter-bar';
import StatisticsDashboard from '@/components/ui/statistics-dashboard';
import AIAdvisor from '@/components/ui/ai-advisor';

export const dynamic = 'force-dynamic';



export default async function CellarPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await auth();
    const resolvedSearchParams = await searchParams; // Await searchParams as required in Next.js 15+

    // Build filter query
    const where: any = {
        userId: session?.user?.id,
        quantity: { gt: 0 }
    };

    if (resolvedSearchParams?.query) {
        where.wine = {
            OR: [
                { name: { contains: resolvedSearchParams.query } },
                { producer: { contains: resolvedSearchParams.query } },
                { region: { contains: resolvedSearchParams.query } }
            ]
        };
    }

    if (resolvedSearchParams?.type) {
        where.wine = { ...where.wine, type: resolvedSearchParams.type };
    }

    if (resolvedSearchParams?.country) {
        where.wine = { ...where.wine, country: resolvedSearchParams.country };
    }

    const cellarItems = await prisma.cellarItem.findMany({
        where,
        include: { wine: true },
        orderBy: { addedAt: 'desc' }
    });

    // Calculate totals for stats
    const totalValue = cellarItems.reduce((sum, item) => sum + ((item.buyPrice || 0) * item.quantity), 0);
    const totalBottles = cellarItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Ma Cave</h1>
                    <p className="text-gray-500 mt-1">Gérez votre collection de vins</p>
                </div>
                <div className="flex items-center gap-3">
                    <FilterBar />
                    <Link href="/dashboard/add" className="bg-wine-900 hover:bg-wine-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-wine-900/20 active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">Ajouter un Vin</span>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Add New Card (First Item) */}
                <Link href="/dashboard/add" className="group relative aspect-[3/4] bg-gray-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-wine-300 dark:hover:border-wine-700 flex flex-col items-center justify-center gap-4 transition-all hover:bg-wine-50 dark:hover:bg-wine-900/10">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-wine-600" />
                    </div>
                    <span className="font-semibold text-gray-500 group-hover:text-wine-900 dark:text-gray-400 dark:group-hover:text-wine-400">Ajouter une bouteille</span>
                </Link>

                {cellarItems.map((item) => (
                    <WineCard key={item.id} item={item} />
                ))}
            </div>

            {/* Statistics Section */}
            <section className="mt-16 border-t border-gray-100 dark:border-zinc-800 pt-10 pb-20">
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                    <TrendingUp className="w-6 h-6 text-wine-600" />
                    Analyse de votre Cave
                </h2>
                <StatisticsDashboard data={cellarItems} totalValue={totalValue} totalBottles={totalBottles} />
            </section>

            {/* AI Advisor Section */}
            <section className="pb-20">
                <AIAdvisor data={cellarItems} />
            </section>
        </div>
    );
}
