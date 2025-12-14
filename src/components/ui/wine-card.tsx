import { CellarItem, Wine } from '@prisma/client';
import { Wine as WineIcon, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WineCardProps {
    item: CellarItem & { wine: Wine };
}

export function WineCard({ item }: WineCardProps) {
    const { wine, quantity, buyPrice } = item;

    return (
        <Link href={`/dashboard/cellar/${item.id}`} className="group relative block bg-white dark:bg-[#1a1c23] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-wine-900/10">
            {/* Image Container */}
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

                {/* Quantity Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                    <span className="text-xs font-serif font-bold text-gray-900 dark:text-white">x{quantity}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase text-wine-900/60 dark:text-wine-400/80">
                        {wine.type}
                    </span>
                    <span className="text-xs font-serif text-gray-400">
                        {wine.vintage}
                    </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-wine-800 dark:group-hover:text-wine-400 transition-colors">
                    {wine.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{wine.producer}</p>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Acheté</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">€{buyPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center justify-end gap-1">
                            Val. Est. <TrendingUp className="w-3 h-3 text-green-500" />
                        </span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-500">
                            €{((buyPrice || 0) * 1.15).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
