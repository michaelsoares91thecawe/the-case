'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, ScanLine, Sparkles } from 'lucide-react';
import { scanLabelAction } from '@/lib/actions';

interface ScannedData {
    name?: string;
    vintage?: string;
    producer?: string;
    type?: string;
    region?: string;
    country?: string;
    grapes?: string;
}

interface LabelScannerProps {
    onScanComplete: (data: ScannedData) => void;
    onClose: () => void;
}

export default function LabelScanner({ onScanComplete, onClose }: LabelScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0); // Mock progress for UX
    const [status, setStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setStatus("Envoi à l'IA...");

        // Mock progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 500);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const result = await scanLabelAction(formData);

            if (result.success && result.data) {
                setStatus("Analyse terminée !");
                setProgress(100);
                setTimeout(() => {
                    onScanComplete(result.data);
                }, 500);
            } else {
                setStatus(result.message || "Erreur d'analyse");
            }
        } catch (err) {
            console.error(err);
            setStatus("Erreur de connexion.");
        } finally {
            clearInterval(interval);
            setTimeout(() => setIsScanning(false), 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-8 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-wine-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white rounded-full transition-colors z-20">
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-10 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-wine-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-wine-900/50 rotate-3 border border-white/10">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold mb-2 text-white">Scanner IA</h2>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Notre intelligence artificielle analyse votre étiquette pour identifier le vin automatiquement.
                    </p>
                </div>

                {isScanning ? (
                    <div className="text-center py-8 relative z-10">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400 animate-pulse" />
                        </div>
                        <p className="font-medium text-lg mb-3 text-white">{status}</p>
                        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Traitement en cours</p>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-wine-500 to-purple-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="group w-full py-4 bg-white text-black hover:bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
                        >
                            <Camera className="w-5 h-5 text-purple-600" />
                            Prendre une photo
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest pt-4">
                            Powered by Google Gemini 2.0
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
