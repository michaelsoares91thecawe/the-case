'use client';

import { updateWine } from '@/lib/actions';
import { useActionState, useState } from 'react';
import { ScanLine } from 'lucide-react';

interface State {
    message: string;
    success?: boolean;
}

const initialState: State = {
    message: '',
};

interface EditWineFormProps {
    id: string; // CellarItem ID
    item: any;  // Initial Data
}

export default function EditWineForm({ id, item }: EditWineFormProps) {
    const updateAction = updateWine.bind(null, id); // Bind ID to action
    const [state, formAction] = useActionState(updateAction, initialState);

    // Initial state from props
    const [formData, setFormData] = useState({
        name: item.wine.name,
        producer: item.wine.producer,
        vintage: item.wine.vintage,
        quantity: item.quantity,
        buyPrice: item.buyPrice || '',
    });

    return (
        <form action={formAction} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Wine Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-zinc-800 pb-2">Modifier le Vin</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nom</label>
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Producteur</label>
                        <input
                            name="producer"
                            type="text"
                            required
                            value={formData.producer}
                            onChange={e => setFormData(prev => ({ ...prev, producer: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Millésime</label>
                            <input
                                name="vintage"
                                type="number"
                                required
                                min="1900"
                                max="2100"
                                value={formData.vintage}
                                onChange={e => setFormData(prev => ({ ...prev, vintage: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                name="type"
                                defaultValue={item.wine.type}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                            >
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
                            <input name="country" type="text" defaultValue={item.wine.country || ''}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Région</label>
                            <input name="region" type="text" defaultValue={item.wine.region || ''}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900" />
                        </div>
                    </div>
                </div>

                {/* Acquisition & Cellar */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-zinc-800 pb-2">Ma Cave</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantité</label>
                            <input
                                name="quantity"
                                type="number"
                                min="0"
                                required
                                value={formData.quantity}
                                onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Prix d'achat (€)</label>
                            <input
                                name="buyPrice"
                                type="number"
                                step="0.01"
                                value={formData.buyPrice}
                                onChange={e => setFormData(prev => ({ ...prev, buyPrice: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <input
                            type="checkbox"
                            name="isVisible"
                            id="isVisible"
                            defaultChecked={item.isVisible}
                            className="w-5 h-5 text-wine-900 rounded"
                        />
                        <label htmlFor="isVisible" className="text-sm font-medium">
                            Visible sur le marché "The Cawe" ?
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => window.history.back()} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                    Annuler
                </button>
                <button type="submit" className="px-6 py-2 bg-wine-900 hover:bg-wine-800 text-white font-medium rounded-lg shadow-sm transition-colors">
                    Enregistrer les modifications
                </button>
            </div>

            <div className="mt-2 text-red-500 text-sm">{state?.message}</div>
            {state?.success && (
                <div className="mt-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                    Mise à jour réussie !
                </div>
            )}
        </form>
    );
}
