'use client';

import { consumeWine } from '@/lib/actions';
import { Wine, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ConsumeButton({ id, quantity }: { id: string, quantity: number }) {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleConsume = async () => {
        if (!confirm('Êtes-vous sûr de vouloir boire 1 bouteille ? Cela mettra à jour votre cave.')) return;

        setLoading(true);
        const result = await consumeWine(id);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleConsume}
            disabled={loading || quantity < 1}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full h-full"
        >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400 mb-2" /> : <Wine className="w-6 h-6 text-wine-900 dark:text-wine-400 mb-2" />}
            <span className="font-bold text-gray-900 dark:text-white">Boire 1 bouteille</span>
            <span className="text-xs text-gray-500">{quantity} restante(s)</span>
        </button>
    );
}
