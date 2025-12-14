import { auth } from '@/auth';
import SearchBar from '@/components/ui/search';
import { MarketplaceCard } from '@/components/ui/marketplace-card';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;
    const query = params?.query || '';
    const session = await auth(); // We need session to EXCLUDE own wines if desired, or maybe keep them

    const where: Prisma.CellarItemWhereInput = {
        isVisible: true,
        // Optional: Exclude my own wines? 
        // userId: { not: session?.user?.id }, 
        wine: {
            OR: [
                { name: { contains: query } },
                { producer: { contains: query } },
                { region: { contains: query } }
            ]
        }
    };

    const marketplaceItems = await prisma.cellarItem.findMany({
        where,
        include: { wine: true },
        orderBy: { addedAt: 'desc' },
        take: 50 // Limit for MVP
    });

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row w-full items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-wine-900 to-red-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        The Cawe Marketplace
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Discover wines from other collectors.</p>
                </div>
            </div>

            <div className="mb-8">
                <SearchBar placeholder="Search The Cawe..." />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {marketplaceItems.map((item) => (
                    <MarketplaceCard key={item.id} item={item} />
                ))}
            </div>

            {marketplaceItems.length === 0 && (
                <div className="mt-10 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500">No public wines found matching your search.</p>
                </div>
            )}
        </div>
    );
}
