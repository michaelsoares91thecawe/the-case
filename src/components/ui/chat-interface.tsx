'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Check, CheckCheck } from 'lucide-react';
import { sendMessage } from '@/lib/actions';
import { useActionState } from 'react';

// Simplistic Chat Interface
// In a real app, this would use optimistic updates, SWR, or WebSockets.
// For this MVP, we use Server Actions + simple state.

interface Message {
    id: string;
    body: string;
    createdAt: Date;
    senderId: string;
    isRead: boolean;
}

interface ChatInterfaceProps {
    initialMessages: Message[];
    recipient: { id: string, name: string, image?: string };
    currentUserId: string;
}

const initialState = {
    message: '',
    success: false
};

export default function ChatInterface({ initialMessages, recipient, currentUserId }: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle sending
    // Note: We are using a simple form action here which will refresh the page via revalidatePath
    // But for better UX, we could append optimistically. 
    // Given the props come from the server component, a full refresh is safer for sync.

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                    {recipient.image ? (
                        <img src={recipient.image} alt={recipient.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-5 h-5 text-gray-500" />
                    )}
                </div>
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">{recipient.name}</h2>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">En ligne (simulé)</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-dots-pattern" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-10">
                        C'est le début de votre conversation avec {recipient.name}. Dites bonjour ! 👋
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[75%] p-3 rounded-2xl text-sm relative group
                                ${isMe
                                    ? 'bg-wine-900 text-white rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }
                            `}>
                                {msg.body}
                                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 ${isMe ? 'text-wine-100' : 'text-gray-500'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#1a1c23] border-t border-gray-100 dark:border-white/5">
                <form
                    action={sendMessage}
                    className="flex gap-2"
                    onSubmit={() => {
                        // Optimistic simulation could go here
                        setTimeout(() => {
                            // Force scroll after send
                            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        }, 500);
                    }}
                >
                    <input type="hidden" name="recipientId" value={recipient.id} />
                    <input
                        type="text"
                        name="body"
                        placeholder="Écrivez votre message..."
                        className="flex-grow px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-wine-500 focus:outline-none transition-all"
                        autoComplete="off"
                        required
                    />
                    <button
                        type="submit"
                        className="p-3 bg-wine-900 hover:bg-wine-800 text-white rounded-xl transition-colors shadow-lg shadow-wine-900/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
