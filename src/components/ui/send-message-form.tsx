'use client';

import { sendMessage } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { Send } from 'lucide-react';

const initialState = {
    message: '',
    success: false
};

export function SendMessageForm({ recipientId, relatedWineId, wineName }: { recipientId: string, relatedWineId: string, wineName: string }) {
    const [state, formAction] = useActionState(sendMessage, initialState);

    // Reset form on success could be complex with useActionState without reset key pattern or controlled inputs, 
    // but for MVP we just show success message.

    if (state?.success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg">
                <p className="font-medium">Message sent successfully!</p>
                <p className="text-sm">The seller will be notified of your interest.</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="recipientId" value={recipientId} />
            <input type="hidden" name="relatedWineId" value={relatedWineId} />

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Send a message to the seller about {wineName}
                </label>
                <textarea
                    id="body"
                    name="body"
                    rows={4}
                    className="w-full rounded-lg border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-wine-500 focus:ring-wine-500 sm:text-sm p-3"
                    placeholder="Hi, I'm interested in this bottle. Is it still available?"
                    required
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-wine-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-wine-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine-900 transition-colors"
                >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                </button>
            </div>

            {state?.message && !state.success && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{state.message}</p>
            )}
        </form>
    );
}
