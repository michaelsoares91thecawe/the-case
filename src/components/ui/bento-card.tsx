import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface BentoCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    colSpan?: number;
}

export function BentoCard({ title, children, className, colSpan = 1 }: BentoCardProps) {
    return (
        <div
            className={clsx(
                "rounded-3xl bg-gray-50 dark:bg-zinc-900 p-6 flex flex-col shadow-sm border border-gray-100 dark:border-zinc-800",
                className,
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
            )}
        >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
            <div className="flex-1 flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
}
