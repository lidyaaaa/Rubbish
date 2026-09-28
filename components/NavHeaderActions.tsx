'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import HelpModal from './HelpModal';

interface NavHeaderActionsProps {
  isLoggedIn: boolean;
}

export default function NavHeaderActions({ isLoggedIn }: NavHeaderActionsProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isHomePage = pathname === '/';

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Back / Home Button for Auth / Sub-pages */}
        {isAuthPage && (
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/90 dark:hover:bg-zinc-700/80 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 transition-all duration-200"
            aria-label="Kembali ke Beranda"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}

        {/* Help Button (Icon Only, Ghost with Hover Glow) */}
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/80 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/90 dark:hover:bg-zinc-700/80 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 transition-all duration-200"
          aria-label="Bantuan dan Panduan"
          title="Bantuan & Panduan"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <DarkModeToggle />
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
