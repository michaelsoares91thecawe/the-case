'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { X, ChevronDown } from 'lucide-react';

const FILTERS = [
    {
        key: 'type',
        label: 'Type',
        options: [
            { label: 'Rouge', value: 'RED' },
            { label: 'Blanc', value: 'WHITE' },
            { label: 'Effervescent', value: 'SPARKLING' },
            { label: 'Rosé', value: 'ROSE' },
        ]
    },
    {
        key: 'country',
        label: 'Pays',
        options: [
            { label: 'France', value: 'France' },
            { label: 'Italie', value: 'Italy' },
            { label: 'USA', value: 'USA' },
            { label: 'Espagne', value: 'Spain' },
        ]
    }
];

export function FilterBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mt-4">
            {FILTERS.map((filter) => {
                const currentValue = searchParams.get(filter.key);
                return (
                    <div key={filter.key} className="relative group">
                        <select
                            className={clsx(
                                "appearance-none pl-3 pr-8 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-wine-500",
                                currentValue
                                    ? "bg-wine-50 border-wine-200 text-wine-900 dark:bg-wine-900/30 dark:border-wine-800 dark:text-wine-100"
                                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300"
                            )}
                            value={currentValue || ""}
                            onChange={(e) => handleFilter(filter.key, e.target.value || null)}
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                    </div>
                );
            })}

            {(searchParams.has('type') || searchParams.has('country')) && (
                <button
                    onClick={() => replace(pathname)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 ml-2"
                >
                    <X className="w-3 h-3" /> Effacer
                </button>
            )}
        </div>
    );
}
