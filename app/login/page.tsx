'use client';

import { login } from '@/actions/auth';
import Link from 'next/link';
import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState = { success: false, error: '' };

// Animation Variants for Stagger Entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 220,
    },
  },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/10">
          <span className="text-3xl">♻️</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5">
          Masuk untuk mulai mengelola poin dan laporan sampah
        </p>
      </motion.div>

      {/* Success alert after registration */}
      {registered && !state.error && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium border border-emerald-500/30 flex items-center gap-3 backdrop-blur-sm shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.</span>
        </motion.div>
      )}

      {/* Error alert */}
      {state.error && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-medium border border-rose-500/30 flex items-center gap-3 backdrop-blur-sm shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{state.error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4 sm:space-y-5">
        <motion.div variants={itemVariants}>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="clay-input pl-10 py-3"
              placeholder="nama@email.com"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="clay-input pl-10 py-3"
              placeholder="••••••••"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="clay-btn w-full py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 group"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : (
              <>
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Footer link */}
      <motion.div
        variants={itemVariants}
        className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 text-center"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold hover:underline transition-all"
          >
            Daftar Sekarang
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md">
        <TiltCard tilt={true} className="p-7 sm:p-10">
          <Suspense fallback={<div className="text-center py-12 text-zinc-400">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>
        </TiltCard>
      </div>
    </div>
  );
}
