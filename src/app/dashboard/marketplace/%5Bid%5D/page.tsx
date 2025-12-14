import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Wine, Calendar, Globe, Award, User, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default async function PublicWineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const cellarItem = await prisma.cellarItem.findUnique({
        where: { id, isVisible: true }, // Must be visible
        include: { wine: true }
    });

    if (!cellarItem) {
        notFound();
    }

    const { wine, quantity, userId } = cellarItem;

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Image & Quick Stats */}
            <div className="md:col-span-1 flex flex-col gap-6">
                <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    {wine.image ? (
                        <Image src={wine.image} alt={wine.name} fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                            <Wine className="w-24 h-24" />
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-zinc-800">
                        <span className="text-sm text-gray-500">Available</span>
                        <span className="font-bold text-xl">{quantity}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">Owner</span>
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800">
                            <User className="w-3 h-3" /> Collector {userId.substring(0, 5)}...
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Details & Offer */}
            <div className="md:col-span-2 space-y-8">
                <div>
                    <div className="flex items-center gap-2 text-wine-900 dark:text-wine-100 font-medium mb-2">
                        <span>{wine.vintage}</span>
                        <span>•</span>
                        <span>{wine.type}</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{wine.name}</h1>
                    <p className="text-xl text-gray-500">{wine.producer}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Region</div>
                        <div className="font-medium text-sm">{wine.region || '-'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Country</div>
                        <div className="font-medium text-sm">{wine.country || '-'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Wine className="w-3 h-3" /> Grapes</div>
                        <div className="font-medium text-sm truncate" title={wine.grapes || ''}>{wine.grapes || '-'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Award className="w-3 h-3" /> Rating</div>
                        <div className="font-medium text-sm">-</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-2">Interested in this wine?</h3>
                    <p className="text-sm text-gray-500 mb-4">Contact the collector to propose a trade or purchase. Your message will be sent anonymously first.</p>

                    <button className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium shadow-md hover:bg-gray-800 transition-colors">
                        <MessageCircle className="w-5 h-5" /> Start Conversation
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center">Protected by The Cawe Guarantee.</p>
                </div>
            </div>
        </div>
    );
}
