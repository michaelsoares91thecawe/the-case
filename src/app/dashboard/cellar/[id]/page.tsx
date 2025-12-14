import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Wine, Calendar, Globe, X, MapPin, Grape, Droplet, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ConsumeButton } from '@/components/ui/consume-button';

export default async function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const cellarItem = await prisma.cellarItem.findUnique({
        where: { id, userId: session?.user?.id },
        include: { wine: true }
    });

    if (!cellarItem) {
        notFound();
    }

    const { wine, quantity, buyPrice, isVisible, addedAt } = cellarItem;

    const details = [
        { icon: MapPin, label: 'Région', value: wine.region },
        { icon: Globe, label: 'Pays', value: wine.country },
        { icon: Grape, label: 'Cépages', value: wine.grapes || 'Assemblage' },
        { icon: Droplet, label: 'Type', value: wine.type },
        { icon: Calendar, label: 'Millésime', value: wine.vintage },
        { icon: Star, label: 'Alcool', value: wine.alcohol ? `${wine.alcohol}%` : 'N/A' },
    ];

    return (
        <div className="max-w-4xl mx-auto relative pt-8 md:pt-0">
            {/* Close / Back Button */}
            {/* Close / Back Button */}
            <div className="absolute -top-2 right-0 md:-right-12 flex flex-col gap-2">
                <Link href="/dashboard/cellar" className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-center" title="Fermer">
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300 mx-auto" />
                </Link>
                <Link href={`/dashboard/cellar/${id}/edit`} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-center" title="Modifier">
                    <span className="sr-only">Modifier</span>
                    {/* Pencil icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-600 dark:text-gray-300 mx-auto"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Visuals (Col 5) */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    <div className="relative aspect-[3/4] w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5">
                        {wine.image ? (
                            <Image src={wine.image} alt={wine.name} fill className="object-contain p-4" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-200 dark:text-zinc-800">
                                <Wine className="w-32 h-32" />
                            </div>
                        )}
                        {/* Quantity Badge */}
                        <div className="absolute top-4 right-4 bg-wine-900 text-white rounded-xl px-4 py-2 font-bold shadow-lg">
                            x{quantity}
                        </div>
                    </div>
                </div>

                {/* Info (Col 7) */}
                <div className="md:col-span-7 space-y-8">
                    <div>
                        <div className="text-wine-900 dark:text-wine-400 font-bold uppercase tracking-widest text-sm mb-2">{wine.producer}</div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-4">{wine.name}</h1>
                        <div className="flex items-center gap-4 text-xl font-medium text-gray-500">
                            <span>{wine.vintage}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            <span>{wine.region}, {wine.country}</span>
                        </div>
                    </div>

                    {/* Clean List View for Details */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                        {details.map((item, i) => (
                            <div key={item.label} className={`flex items-center justify-between p-4 ${i !== details.length - 1 ? 'border-b border-gray-50 dark:border-white/5' : ''}`}>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <item.icon className="w-5 h-5 opacity-70" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <div className="font-bold text-gray-900 dark:text-white text-right">
                                    {item.value || '-'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 h-32">
                        <ConsumeButton id={id} quantity={quantity} />

                        <button className="flex flex-col items-center justify-center p-4 bg-wine-900 text-white rounded-xl hover:bg-wine-800 transition-all shadow-lg shadow-wine-900/20 active:scale-95">
                            <Star className="w-6 h-6 mb-2" />
                            <span className="font-bold">Noter ce vin</span>
                            <span className="text-xs text-wine-200">Ajouter un avis</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
