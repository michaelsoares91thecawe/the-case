'use client';

import { useMemo } from 'react';
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// ... (code)

<Geographies geography={geoUrl}>
    {({ geographies }: { geographies: any[] }) =>
        geographies.map((geo: any) => {
            const isHighlighted = countryCodes.includes(geo.properties.ISO_A3);
            return (
                <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? "#bea932" : "#3f3f46"}
                    stroke="#18181b"
                    strokeWidth={0.5}
                    style={{
                        default: { outline: "none" },
                        hover: { fill: isHighlighted ? "#d4bd39" : "#52525b", outline: "none" },
                        pressed: { outline: "none" },
                    }}
                />
            );
        })
    }
</Geographies>
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Wine, Globe, TrendingUp } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface StatisticsProps {
    data: any[]; // Cellar Items with Wine details
    totalValue: number;
    totalBottles: number;
}

const COLORS = ['#4a0404', '#eab308', '#fca5a5', '#9ca3af', '#8b5cf6'];

export default function StatisticsDashboard({ data, totalValue, totalBottles }: StatisticsProps) {
    // 1. Prepare Data for Pie Chart (Type)
    const typeData = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            const type = item.wine.type;
            counts[type] = (counts[type] || 0) + item.quantity;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    // 2. Prepare Data for Markers (Country) - Simplified Lat/Lng for demo
    // Ideally we need a real geocoding or lookup table.
    // For this MVP, we will highlight countries by Name matching.
    const countryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            const country = item.wine.country || 'Unknown';
            counts[country] = (counts[country] || 0) + item.quantity;
        });
        return counts;
    }, [data]);

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                    <div className="p-3 bg-wine-100 dark:bg-wine-900/20 rounded-xl text-wine-900 dark:text-wine-400">
                        <Wine className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Bouteilles</p>
                        <p className="text-3xl font-serif font-bold dark:text-white">{totalBottles}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Valeur Estimée</p>
                        <p className="text-3xl font-serif font-bold dark:text-white">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalValue)}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-400">
                        <Globe className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pays / Régions</p>
                        <p className="text-3xl font-serif font-bold dark:text-white">{Object.keys(countryCounts).length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        Répartition par Type
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Map Section */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96 overflow-hidden">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        Origine des Vins
                    </h3>
                    <div className="h-full w-full">
                        <ComposableMap projectionConfig={{ scale: 140 }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }: { geographies: any[] }) =>
                                    geographies.map((geo: any) => {
                                        const isHighlighted = countryCounts[geo.properties.name] || 0;
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={isHighlighted ? "#7f1d1d" : "#e5e7eb"}
                                                stroke="#D6D6DA"
                                                strokeWidth={0.5}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: "#991b1b", outline: "none" },
                                                    pressed: { outline: "none" },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>
                </div>
            </div>
        </div>
    );
}
