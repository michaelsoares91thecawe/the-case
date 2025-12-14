'use client';

import { createWine } from '@/lib/actions';
import { useActionState, useState } from 'react';
import { ScanLine } from 'lucide-react';
import LabelScanner from './label-scanner';

const initialState = {
    message: '',
};

export default function AddWineForm() {
    const [state, formAction] = useActionState(createWine, initialState);
    const [showScanner, setShowScanner] = useState(false);

    // Form State for Auto-fill
    const [formData, setFormData] = useState({
        name: '',
        producer: '',
        vintage: '',
    });

    const handleScanComplete = (data: { name?: string; producer?: string; vintage?: string }) => {
        setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            producer: data.producer || prev.producer,
            vintage: data.vintage || prev.vintage,
        }));
        setShowScanner(false);
    };

    return (
        <>
            {showScanner && (
                <LabelScanner
                    onClose={() => setShowScanner(false)}
                    onScanComplete={handleScanComplete}
                />
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-serif">Ajouter un Vin</h2>
                <button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                >
                    <ScanLine className="w-4 h-4" />
                    Scanner Étiquette
                </button>
            </div>

            <form action={formAction} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Wine Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-zinc-700 pb-2">Détails du Vin</h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="ex: Château Margaux"
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Producteur</label>
                            <input
                                name="producer"
                                type="text"
                                placeholder="ex: Château Margaux"
                                required
                                value={formData.producer}
                                onChange={e => setFormData(prev => ({ ...prev, producer: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Millésime</label>
                                <input
                                    name="vintage"
                                    type="number"
                                    placeholder="2015"
                                    required
                                    min="1900"
                                    max="2100"
                                    value={formData.vintage}
                                    onChange={e => setFormData(prev => ({ ...prev, vintage: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select name="type" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700">
                                    <option value="RED">Rouge</option>
                                    <option value="WHITE">Blanc</option>
                                    <option value="SPARKLING">Effervescent</option>
                                    <option value="ROSE">Rosé</option>
                                    <option value="OTHER">Autre</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Pays</label>
                                <input name="country" type="text" placeholder="France"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Région</label>
                                <input name="region" type="text" placeholder="Bordeaux"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700" />
                            </div>
                        </div>
                    </div>

                    {/* Acquisition & Cellar */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-zinc-700 pb-2">Ma Cave</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantité</label>
                                <input name="quantity" type="number" defaultValue="1" min="1" required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Prix d'achat (€)</label>
                                <input name="buyPrice" type="number" step="0.01" placeholder="0.00"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-700" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                            <input type="checkbox" name="isVisible" id="isVisible" defaultChecked className="w-5 h-5 text-wine-900 rounded" />
                            <label htmlFor="isVisible" className="text-sm font-medium">
                                Visible sur le marché "The Cawe" ?
                                <span className="block text-xs text-gray-500 font-normal">Les autres utilisateurs peuvent voir cette bouteille mais pas vos infos personnelles.</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                        Annuler
                    </button>
                    <button type="submit" className="px-6 py-2 bg-wine-900 hover:bg-wine-800 text-white font-medium rounded-lg shadow-sm transition-colors">
                        Ajouter à la Cave
                    </button>
                </div>

                <div className="mt-2 text-red-500 text-sm">{state?.message}</div>
            </form>
        </>
    );
}
