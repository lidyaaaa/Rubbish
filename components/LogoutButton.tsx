'use client';

import { logout } from '@/actions/auth';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
      >
        Logout
      </button>
    </form>
  );
}
