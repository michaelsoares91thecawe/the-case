import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 overflow-hidden flex flex-col">
      {/* Background elements for visual flair */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-wine-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-wine-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-wine-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white shadow-lg">
              ✨ La cave réinventée
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-xl animate-slide-up">
            L'Art de Collectionner <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f9e5a4]">
              le Vin d'Exception
            </span>
          </h1>
          <p className="text-xl text-zinc-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md animate-slide-up-delay">
            Gérez votre cave, suivez la valorisation de vos crus et accédez à un marché exclusif de passionnés.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-up">
            <Link href="/login" className="px-8 py-4 bg-white text-wine-950 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-xl shadow-black/20 hover:scale-105 active:scale-95">
              Se connecter
            </Link>
            <Link href="/signup" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              S'inscrire
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} The Cawe. All rights reserved.</p>
      </footer>
    </div>
  );
}
