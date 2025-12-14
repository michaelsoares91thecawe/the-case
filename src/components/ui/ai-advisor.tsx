'use client';

import { useState } from 'react';
import { generateCellarAdvice } from '@/lib/ai';
import { Sparkles, Loader2, Send, MessageSquare } from 'lucide-react';

export default function AIAdvisor({ data }: { data: any[] }) {
    const [advice, setAdvice] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [mode, setMode] = useState<'INITIAL' | 'CHAT'>('INITIAL');

    const handleAskAI = async (customQuestion?: string) => {
        setLoading(true);
        setMode('CHAT');
        const result = await generateCellarAdvice(data, customQuestion);
        setAdvice(result);
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        handleAskAI(question);
    };

    return (
        <div className="bg-gradient-to-br from-wine-900 to-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                            <Sparkles className="w-6 h-6 text-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold">Le Sommelier IA</h2>
                            <p className="text-white/60 text-sm">Posez une question sur votre cave ou obtenez un bilan</p>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10 mb-8 flex items-center gap-2">
                    <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Ex: Que boire avec un rôti de bœuf ? / Il me manque quoi ?"
                            className="flex-grow bg-transparent border-none text-white placeholder-white/40 focus:ring-0 px-4 py-3"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="p-3 bg-white text-wine-900 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {loading && question ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>

                {/* Quick Actions (Only in Initial Mode) */}
                {mode === 'INITIAL' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                        <button
                            onClick={() => handleAskAI()}
                            className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                        >
                            <Sparkles className="w-8 h-8 text-yellow-300 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-lg mb-1">Bilan Global</h3>
                            <p className="text-sm text-white/60">Analyse l'équilibre, les points forts et suggère des achats.</p>
                        </button>
                        <button
                            onClick={() => {
                                setQuestion("Quelle bouteille ouvrir pour un dîner romantique ?");
                                handleAskAI("Quelle bouteille ouvrir pour un dîner romantique ?");
                            }}
                            className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                        >
                            <MessageSquare className="w-8 h-8 text-pink-300 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-lg mb-1">Suggestion Dîner</h3>
                            <p className="text-sm text-white/60">Trouvez la bouteille parfaite pour une occasion spéciale.</p>
                        </button>
                    </div>
                )}

                {/* Response Area */}
                {(loading && !question && mode === 'CHAT') && (
                    <div className="text-center py-12 animate-fade-in">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white/50" />
                        <p className="text-lg animate-pulse">Le sommelier réfléchit...</p>
                    </div>
                )}

                {advice && mode === 'CHAT' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 animate-slide-up shadow-xl">
                        <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap font-sans leading-relaxed text-lg">
                                {advice}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => {
                                    setAdvice(null);
                                    setMode('INITIAL');
                                    setQuestion('');
                                }}
                                className="text-sm text-zinc-400 hover:text-white underline decoration-zinc-600 underline-offset-4"
                            >
                                Nouvelle recherche
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
