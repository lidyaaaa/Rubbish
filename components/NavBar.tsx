import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { getSession } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';

export default async function NavBar() {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN';

  return (
    <nav className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-clay-card/90 dark:bg-clay-card-dark/90 backdrop-blur-xl shadow-clay-sm dark:shadow-clay-dark-sm border border-white/60 dark:border-white/5">

          {/* Logo */}
          <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-clay-xs dark:shadow-clay-dark-xs group-hover:scale-105 transition-transform">
              <span className="text-lg">♻️</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Rubbish
            </span>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link href="/dashboard" className="nav-link">
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden text-base">🏠</span>
                </Link>

                {/* Redeem hanya untuk User */}
                {!isAdmin && (
                  <Link href="/redeem" className="nav-link">
                    <span className="hidden sm:inline">Redeem</span>
                    <span className="sm:hidden text-base">🎁</span>
                  </Link>
                )}

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

                {/* Role badge */}
                <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isAdmin
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {isAdmin ? '🛡️ Admin' : '👤 User'}
                </span>

                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="clay-btn py-2 px-4 text-sm"
              >
                Masuk
              </Link>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
