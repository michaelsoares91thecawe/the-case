'use client';

import { useState, useRef } from 'react';
import { Download, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { exportCellar, importCellar } from '@/lib/actions';

export default function DataManagementCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await exportCellar();
            if (result.success && result.csv) {
                // Trigger Download
                const blob = new Blob([result.csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename || 'export.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setMessage({ type: 'success', text: "Export réussi !" });
            } else {
                setMessage({ type: 'error', text: result.message || "Erreur lors de l'export" });
            }
        } catch (e) {
            setMessage({ type: 'error', text: "Erreur de connexion" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setMessage({ type: 'error', text: "Veuillez sélectionner un fichier CSV." });
            return;
        }

        if (!confirm("Attention : L'importation va ajouter des bouteilles à votre cave. Si le fichier contient des doublons, ils seront ajoutés. Continuer ?")) {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await importCellar(formData);
            if (result.success) {
                setMessage({ type: 'success', text: result.message || "Import réussi !" });
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setMessage({ type: 'error', text: result.message || "Erreur lors de l'import" });
            }
        } catch (e) {
            setMessage({ type: 'error', text: "Erreur lors de l'envoi du fichier." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="font-bold font-serif mb-4 flex items-center gap-2">
                <Download className="w-4 h-4" /> Données (Export / Import)
            </h3>

            <div className="space-y-3">
                <button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="w-full py-3 border border-wine-900 text-wine-900 dark:border-wine-400 dark:text-wine-400 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-wine-50 dark:hover:bg-wine-900/20 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Exporter ma Cave (CSV)
                </button>

                <button
                    onClick={handleImportClick}
                    disabled={isLoading}
                    className="w-full py-3 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Importer (CSV)
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                />
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                    {message.text}
                </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center">
                Format supporté : CSV (Séparateur virgule). <br />
                Colonnes : Name, Producer, Vintage, Type, Region, Country, Quantity, Price.
            </p>
        </div>
    );
}
