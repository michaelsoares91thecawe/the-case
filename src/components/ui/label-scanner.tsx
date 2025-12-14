'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, ScanLine } from 'lucide-react';
// Tesseract imported dynamically to avoid SSR __dirname errors

interface ScannedData {
    name?: string;
    vintage?: string;
    producer?: string;
}

interface LabelScannerProps {
    onScanComplete: (data: ScannedData) => void;
    onClose: () => void;
}

export default function LabelScanner({ onScanComplete, onClose }: LabelScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setStatus('Chargement du moteur...');

        try {
            const Tesseract = (await import('tesseract.js')).default;
            // Tesseract v6: createWorker(langs, oem, options)
            const worker = await Tesseract.createWorker('eng+fra', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.floor(m.progress * 100));
                        setStatus(`Analyse de l'étiquette... ${Math.floor(m.progress * 100)}%`);
                    } else {
                        setStatus(m.status);
                    }
                }
            });

            const { data: { text } } = await worker.recognize(file);
            console.log("OCR Result:", text);

            const extracted = parseWineText(text);
            onScanComplete(extracted);

            await worker.terminate();
        } catch (err) {
            console.error(err);
            setStatus("Échec de l'analyse. Veuillez réessayer.");
        } finally {
            setIsScanning(false);
        }
    };

    // Simple heuristic parser
    const parseWineText = (text: string): ScannedData => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        const data: ScannedData = {};

        // 1. Find Year (1900-2099)
        const yearMatch = text.match(/(19|20)\d{2}/);
        if (yearMatch) {
            data.vintage = yearMatch[0];
        }

        // 2. Guess Name/Producer (Take largest text blocks or specific keywords)
        // This is very basic. Real implementation would look for "Chateau", "Domaine", etc.
        const estateKeywords = ['CHATEAU', 'DOMAINE', 'CLOS', 'MAS', 'TENUTA', 'BODEGA'];

        for (const line of lines) {
            const upper = line.toUpperCase();
            if (estateKeywords.some(k => upper.includes(k))) {
                if (!data.producer) data.producer = line;
                else if (!data.name) data.name = line; // Assumption
            }
        }

        // Fallback: Use first non-year lines as name properties
        const unusedLines = lines.filter(l => l !== data.producer && l !== data.name && !l.includes(data.vintage || 'XXXX'));

        if (!data.name && unusedLines.length > 0) data.name = unusedLines[0];
        if (!data.producer && unusedLines.length > 1) data.producer = unusedLines[1];

        return data;
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-wine-100 dark:bg-wine-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ScanLine className="w-8 h-8 text-wine-600 dark:text-wine-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-2">Scanner Étiquette</h2>
                    <p className="text-gray-500 text-sm">Prenez une photo ou importez une image de l'étiquette.</p>
                </div>

                {isScanning ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-10 h-10 text-wine-600 animate-spin mx-auto mb-4" />
                        <p className="font-medium text-lg mb-2">{status}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-wine-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 bg-wine-900 hover:bg-wine-800 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-colors"
                        >
                            <Camera className="w-5 h-5" />
                            Prendre Photo / Importer
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        <p className="text-xs text-center text-gray-400">
                            Formats supportés : JPG, PNG. <br />
                            Le traitement s'effectue localement sur votre appareil.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
