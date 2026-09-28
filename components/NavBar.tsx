import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';
import NavHeaderActions from './NavHeaderActions';
import { Sparkles, LayoutDashboard, Gift } from 'lucide-react';

export default async function NavBar() {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 sm:py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Pojok Kiri Atas: Brand Logo Minimalis */}
        <Link
          href={session ? '/dashboard' : '/'}
          className="group flex items-center gap-2.5 select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300">
            <span className="text-xl">♻️</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
              Rubbish
            </span>
          </div>
        </Link>

        {/* Pojok Kanan Atas: Floating Actions & Session Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-white/10 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {!isAdmin && (
                <Link
                  href="/redeem"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-white/10 transition-all"
                >
                  <Gift className="w-4 h-4 text-teal-500" />
                  <span className="hidden sm:inline">Redeem</span>
                </Link>
              )}

              {/* Role badge */}
              <span
                className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isAdmin
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isAdmin ? '🛡️ Admin' : '👤 User'}
              </span>

              <LogoutButton />

              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5 sm:mx-1" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-all duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex clay-btn py-1.5 px-4 text-xs font-semibold"
              >
                Daftar
              </Link>
              <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
            </div>
          )}

          {/* Minimalist Floating Icon Buttons (Help & Theme Toggle) */}
          <NavHeaderActions isLoggedIn={!!session} />
        </div>
      </div>
    </header>
  );
}
