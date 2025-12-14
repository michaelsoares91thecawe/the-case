import { auth } from '@/auth';
import { User, Mail, Phone, MapPin, Shield, LogOut } from 'lucide-react';
import { signOut } from '@/auth';
import DataManagementCard from '@/components/ui/data-management-card';

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-wide">Account Details</h1>
                    <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
                </div>
                <div className="flex gap-3">
                    <form action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </form>
                    <button className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                        Edit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Sidebar Cards (Col 4) */}
                <div className="md:col-span-4 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-[#1a1c23] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/5 text-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4">
                            {user?.image ? (
                                <img src={user.image} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold font-serif">{user?.name}</h2>
                        <p className="text-gray-500 text-sm mb-6">{user?.email}</p>

                        <div className="space-y-4 text-left border-t border-gray-100 dark:border-white/5 pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm">Public Profile</div>
                                    <div className="text-xs text-gray-400">Visible to community</div>
                                </div>
                                <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm">Public Cellar</div>
                                    <div className="text-xs text-gray-400">Allow others to view</div>
                                </div>
                                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Card */}
                    <DataManagementCard />
                </div>

                {/* Main Form Area (Col 8) */}
                <div className="md:col-span-8 space-y-8">
                    {/* Coordinates */}
                    <section>
                        <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">Coordinates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 text-gray-900 dark:text-gray-100">
                                    {user?.name}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email (Primary)</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 text-gray-900 dark:text-gray-100">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 text-gray-400">
                                    +33 6...
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Secondary Email</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 text-gray-400">
                                    -
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-gray-100 dark:bg-white/5" />

                    {/* Address */}
                    <section>
                        <h3 className="text-xl font-bold font-serif mb-6">Billing Address</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Address</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 h-10"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</label>
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 h-10"></div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Postal Code</label>
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 h-10"></div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country</label>
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/10 h-10"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-gray-100 dark:bg-white/5" />

                    {/* Marketing */}
                    <section>
                        <h3 className="text-xl font-bold font-serif mb-6">Marketing Preferences</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <span className="font-medium">Receive marketing emails</span>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="marketing" className="text-wine-900" defaultChecked /> Yes
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="marketing" className="text-wine-900" /> No
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section>
                        <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Security
                        </h3>
                        <button className="text-wine-900 dark:text-wine-400 font-bold hover:underline">
                            Change Password
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}

