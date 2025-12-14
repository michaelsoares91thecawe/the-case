import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditWineForm from '@/components/ui/edit-wine-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditWinePage({ params }: { params: { id: string } }) {
    const item = await prisma.cellarItem.findUnique({
        where: { id: params.id },
        include: { wine: true }
    });

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link href={`/dashboard/cellar/${params.id}`} className="inline-flex items-center text-gray-500 hover:text-wine-900 mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour au vin
            </Link>

            <h1 className="text-2xl font-serif font-bold mb-8">Modification</h1>

            <EditWineForm id={item.id} item={item} />
        </div>
    );
}
