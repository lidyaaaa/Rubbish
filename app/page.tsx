import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
      <div className="max-w-xl w-full text-center p-10 sm:p-12 rounded-[2rem] bg-clay-card dark:bg-clay-card-dark shadow-clay dark:shadow-clay-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-clay-sm dark:shadow-clay-dark-sm">
            <span className="text-5xl drop-shadow-md">♻️</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Rubbish
            </span>
          </h1>
          
          <p className="text-clay-muted dark:text-clay-muted-dark text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Ubah sampah menjadi berkah. Laporkan tumpukan sampah, biarkan kami menjemputnya, dan kumpulkan poin untuk ditukar dengan reward menarik!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="/login" className="clay-btn py-3.5 px-8 text-base w-full sm:w-auto">
              Mulai Sekarang
            </Link>
            <Link href="/register" className="clay-btn clay-btn-secondary py-3.5 px-8 text-base w-full sm:w-auto">
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
