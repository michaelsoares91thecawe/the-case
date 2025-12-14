import AddWineForm from '@/components/ui/add-wine-form';
import { Camera } from 'lucide-react';

export default function AddWinePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Add Wine</h1>
                <button className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Scan Label</span>
                </button>
            </div>

            <AddWineForm />
        </div>
    );
}
