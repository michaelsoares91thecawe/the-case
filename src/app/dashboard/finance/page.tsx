import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CircleDollarSign, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';

export default async function FinancePage() {
    const session = await auth();
    const user = session?.user;

    // Fetch Stats
    const stats = await prisma.cellarItem.aggregate({
        where: { userId: user?.id },
        _sum: { buyPrice: true, quantity: true },
    });

    const totalSpent = stats._sum.buyPrice || 0;
    const estimatedValue = totalSpent * 1.15; // +15% mock
    const profit = estimatedValue - totalSpent;

    return (
        <div className="w-full space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Finance & Value</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold tracking-wider">Total Invested</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">€{totalSpent.toLocaleString()}</div>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <CircleDollarSign className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold tracking-wider">Current Valuation</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">€{estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>

                <div className="bg-wine-900 p-6 rounded-2xl shadow-sm text-white">
                    <div className="flex items-center gap-3 text-wine-200 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold tracking-wider">Unrealized Profit</span>
                    </div>
                    <div className="text-3xl font-bold">+€{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div className="text-sm text-green-300 font-bold mt-1">+15% ROI</div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white dark:bg-[#1a1c23] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                    <h3 className="text-xl font-bold mb-2">Portfolio Performance</h3>
                    <p className="text-gray-500">Charts coming soon in Version 2.0</p>
                </div>
                {/* Abstract background for "Premium" feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent dark:from-white/5 pointer-events-none" />
            </div>

            {/* Recent Transactions List */}
            <div>
                <h3 className="font-serif font-bold text-xl mb-4">Recent Spending</h3>
                <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex text-xs font-bold uppercase text-gray-500">
                        <div className="w-1/3">Item</div>
                        <div className="w-1/3">Date</div>
                        <div className="w-1/3 text-right">Amount</div>
                    </div>
                    {/* Placeholder Rows */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 flex items-center text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="w-1/3 font-medium">Wine Purchase #{i}</div>
                            <div className="w-1/3 text-gray-500">Oct {10 + i}, 2024</div>
                            <div className="w-1/3 text-right font-mono font-bold">-€{85 * i}.00</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
