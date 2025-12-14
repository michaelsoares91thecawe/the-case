import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { SendMessageForm } from '@/components/ui/send-message-form';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Wine, User, Calendar, MapPin, Grape } from 'lucide-react';

export default async function MarketplaceItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const item = await prisma.cellarItem.findUnique({
        where: { id },
        include: {
            wine: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true, // Maybe don't expose email directly, but needed for identifying
                }
            }
        }
    });

    if (!item) {
        notFound();
    }

    const { wine, user: seller } = item;
    const isOwner = session?.user?.id === seller.id;

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row">

                {/* Image Section */}
                <div className="w-full md:w-1/2 relative bg-gray-50 dark:bg-zinc-800 min-h-[400px] flex items-center justify-center p-8">
                    {wine.image ? (
                        <div className="relative w-full h-[500px]">
                            <Image
                                src={wine.image}
                                alt={wine.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <Wine className="w-32 h-32 text-gray-300 dark:text-zinc-600" />
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-wine-100 text-wine-900 dark:bg-wine-900/30 dark:text-wine-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {wine.type}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <User className="w-4 h-4" />
                            <span>Seller: {seller.name || 'Anonymous User'}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
                        {wine.name}
                    </h1>
                    <p className="text-xl text-gray-500 font-serif mb-6">{wine.producer}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-wine-900 dark:text-wine-400 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Vintage</p>
                                <p className="font-medium text-lg">{wine.vintage}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-wine-900 dark:text-wine-400 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Region</p>
                                <p className="font-medium text-lg">{wine.region || 'Unknown'}, {wine.country}</p>
                            </div>
                        </div>
                        {wine.grapes && (
                            <div className="col-span-2 flex items-start gap-3">
                                <Grape className="w-5 h-5 text-wine-900 dark:text-wine-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Grape Variety</p>
                                    <p className="font-medium text-lg">{wine.grapes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Available Quantity</p>
                                <p className="text-2xl font-bold">{item.quantity} Bottles</p>
                            </div>
                            {/* Price could be here if we had a selling price, using generic offer for now */}
                        </div>

                        {!isOwner ? (
                            <SendMessageForm
                                recipientId={seller.id}
                                relatedWineId={wine.id}
                                wineName={wine.name}
                            />
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-center">
                                This is your bottle.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
