'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import { Sparkles, ArrowRight, ShieldCheck, Gift, Truck } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 200,
    },
  },
};

export default function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-2xl">
        <TiltCard tilt={true} className="p-8 sm:p-12 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center relative z-10"
          >
            {/* Badge pill */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Platform Pengelolaan Sampah Cerdas & Berhadiah</span>
            </motion.div>

            {/* Logo Emblem */}
            <motion.div
              variants={itemVariants}
              className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-500/10"
            >
              <span className="text-4xl sm:text-5xl drop-shadow-md">♻️</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-4"
            >
              Ubah Sampah Jadi{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Berkah
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8"
            >
              Laporkan tumpukan sampah dari rumah, sekolah, perusahaan, atau apartemen. 
              Tim kami jemput dan tukarkan poin Anda dengan aneka reward menarik!
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md mb-8 text-left"
            >
              <div className="p-3 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col items-center text-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Jemput Lokasi</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col items-center text-center gap-1.5">
                <Gift className="w-4 h-4 text-teal-500" />
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Poin & Reward</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col items-center text-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Terverifikasi</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto justify-center"
            >
              <Link
                href="/login"
                className="clay-btn py-3.5 px-8 text-sm sm:text-base font-bold w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="clay-btn clay-btn-secondary py-3.5 px-8 text-sm sm:text-base font-bold w-full sm:w-auto flex items-center justify-center"
              >
                Buat Akun Baru
              </Link>
            </motion.div>
          </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
