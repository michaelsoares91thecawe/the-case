import { CellarItem, Wine } from '@prisma/client';
import { Wine as WineIcon, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MarketplaceCardProps {
    item: CellarItem & { wine: Wine };
}

export function MarketplaceCard({ item }: MarketplaceCardProps) {
    const { wine, quantity } = item;

    return (
        <Link href={`/dashboard/marketplace/${item.id}`} className="group relative block bg-white dark:bg-[#1a1c23] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-wine-900/10">
            {/* Image Container with Soft Background */}
            <div className="relative aspect-[4/5] bg-[#f8f5f2] dark:bg-[#151518] flex items-center justify-center p-8 overflow-hidden">
                {wine.image ? (
                    <div className="relative w-full h-full shadow-2xl shadow-black/20 transform group-hover:-translate-y-2 transition-transform duration-500">
                        <Image
                            src={wine.image}
                            alt={wine.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <WineIcon className="h-24 w-24 text-gray-300 dark:text-white/10" />
                )}

                {/* Available Badge - Elegant Pill */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 dark:border-white/10">
                    <span className="text-xs font-semibold text-wine-900 dark:text-wine-400">{quantity} Available</span>
                </div>
            </div>

            {/* Content Info */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase text-gold-600 dark:text-gold-500">
                        {wine.region || wine.country}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {wine.vintage}
                        </span>
                    </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-wine-800 dark:group-hover:text-wine-400 transition-colors">
                    {wine.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-medium mb-4">{wine.producer}</p>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Collector {item.userId.substring(0, 5)}</span>
                    </div>
                    <span className="text-sm font-semibold text-wine-900 dark:text-white underline decoration-wine-200 dark:decoration-wine-800 underline-offset-4 group-hover:decoration-wine-600 transition-all">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
}
