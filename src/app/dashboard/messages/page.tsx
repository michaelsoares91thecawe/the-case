import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Mail, Clock, ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return <div className="p-8">Please log in to view messages.</div>;
    }

    // Fetch all messages involving the user
    // We need raw query or efficient grouping to get "Conversations"
    // For MVP/Prisma safety, let's fetch all relevant messages and group in JS.
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            sender: { select: { id: true, name: true, image: true } },
            receiver: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Group by "Other User"
    const conversationsMap = new Map();

    messages.forEach(msg => {
        const isSender = msg.senderId === userId;
        const otherUser = isSender ? msg.receiver : msg.sender;

        if (!conversationsMap.has(otherUser.id)) {
            conversationsMap.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg,
                unreadCount: 0
            });
        }

        // Count unread (only if I am the receiver)
        if (!isSender && !msg.isRead) {
            conversationsMap.get(otherUser.id).unreadCount++;
        }
    });

    const conversations = Array.from(conversationsMap.values());

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-2">Messages</h1>
                    <p className="text-gray-500 dark:text-gray-400">Vos échanges avec la communauté</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1c23] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                {conversations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Aucune conversation pour le moment.</p>
                        <Link href="/dashboard/marketplace" className="text-wine-900 font-bold hover:underline mt-2 inline-block">
                            Découvrir des vins et contacter des membres
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {conversations.map(({ user, lastMessage, unreadCount }) => (
                            <Link
                                key={user.id}
                                href={`/dashboard/messages/${user.id}`}
                                className="block p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-400 overflow-hidden">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name[0]
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#1a1c23]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                                                {user.name}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(lastMessage.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 dark:text-gray-200 font-medium' : 'text-gray-500'}`}>
                                            {lastMessage.senderId === userId && "Vous: "}
                                            {lastMessage.body}
                                        </p>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-wine-900 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
