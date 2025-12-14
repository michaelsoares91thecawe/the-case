import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import ChatInterface from '@/components/ui/chat-interface';
import { redirect } from 'next/navigation';

export default async function ChatPage({ params }: { params: { userId: string } }) {
    const session = await auth();
    const currentUserId = session?.user?.id;
    const { userId: otherUserId } = params;

    if (!currentUserId) redirect('/login');

    // 1. Mark messages as read
    await prisma.message.updateMany({
        where: {
            senderId: otherUserId,
            receiverId: currentUserId,
            isRead: false
        },
        data: { isRead: true }
    });

    // 2. Fetch Conversation History
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId }
            ]
        },
        orderBy: { createdAt: 'asc' } // Oldest first for chat view
    });

    // 3. Fetch recipient details
    const recipient = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, name: true, image: true }
    });

    if (!recipient) {
        return <div className="p-8">Utilisateur introuvable.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto h-full">
            <ChatInterface
                initialMessages={messages}
                recipient={{ id: recipient.id, name: recipient.name || 'Utilisateur', image: recipient.image || undefined }}
                currentUserId={currentUserId}
            />
        </div>
    );
}
