import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return <div className="p-8">Please log in to view messages.</div>;
    }

    // Fetch received messages
    const receivedMessages = await prisma.message.findMany({
        where: { receiverId: userId },
        include: {
            sender: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Fetch sent messages
    const sentMessages = await prisma.message.findMany({
        where: { senderId: userId },
        include: {
            receiver: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inbox */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Mail className="w-5 h-5" /> Inbox
                    </h2>
                    {receivedMessages.length === 0 ? (
                        <p className="text-gray-500 italic">No received messages.</p>
                    ) : (
                        receivedMessages.map((msg) => (
                            <div key={msg.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-wine-900 dark:text-wine-100">
                                        From: {msg.sender.name || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{msg.body}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Sent */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-500">
                        <ArrowRight className="w-5 h-5" /> Sent
                    </h2>
                    {sentMessages.length === 0 ? (
                        <p className="text-gray-500 italic">No sent messages.</p>
                    ) : (
                        sentMessages.map((msg) => (
                            <div key={msg.id} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        To: {msg.receiver.name || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{msg.body}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
