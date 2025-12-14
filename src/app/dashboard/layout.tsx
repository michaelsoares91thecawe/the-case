import SideNav from '@/components/layout/sidenav';
import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userRole = session?.user?.role;

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white dark:bg-black text-black dark:text-white">
            <div className="w-full flex-none md:w-64">
                <SideNav userRole={userRole} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
