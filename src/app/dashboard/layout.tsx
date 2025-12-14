import SideNav from '@/components/layout/sidenav';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userRole = session?.user?.role;

    // Fetch unread messages count
    const unreadCount = session?.user?.id ? await prisma.message.count({
        where: {
            receiverId: session.user.id,
            isRead: false
        }
    }) : 0;

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white dark:bg-black text-black dark:text-white">
            <div className="w-full flex-none md:w-64">
                <SideNav userRole={userRole} unreadCount={unreadCount} />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
