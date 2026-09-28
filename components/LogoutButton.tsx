'use client';

import { logout } from '@/actions/auth';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <form action={logout} className="inline-flex items-center">
      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
        title="Keluar dari akun"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </form>
  );
}
