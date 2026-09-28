'use client';

import { login } from '@/actions/auth';
import Link from 'next/link';
import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const initialState = { success: false, error: '' };

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await login(formData);
      return result ?? initialState;
    },
    initialState
  );

  return (
    <>
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-clay-sm dark:shadow-clay-dark-sm">
          <span className="text-3xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Selamat Datang Kembali
        </h1>
        <p className="text-clay-muted dark:text-clay-muted-dark text-sm mt-1.5">
          Masuk untuk mulai mengelola poin dan laporanmu.
        </p>
      </div>

      {registered && !state.error && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-100 dark:border-emerald-800/30 text-center">
          Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.
        </div>
      )}

      {state.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800/30 text-center">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5 relative z-10">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="clay-input py-3"
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="clay-input py-3"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={pending} className="clay-btn w-full py-3.5 mt-2 text-base">
          {pending ? 'Memproses...' : 'Masuk ke Akun'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 relative z-10">
        <p className="text-center text-sm text-clay-muted dark:text-clay-muted-dark">
          Belum punya akun?{' '}
          <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold transition-colors">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-[2rem] bg-clay-card dark:bg-clay-card-dark shadow-clay dark:shadow-clay-dark relative overflow-hidden">
        <Suspense fallback={<div className="text-center">Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
