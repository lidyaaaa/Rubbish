'use client';

import { register } from '@/actions/auth';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  GraduationCap,
  Building2,
  Building,
  Mail,
  Phone,
  Lock,
  User,
  CreditCard,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

type TipePendaftaran = 'RUMAH' | 'SEKOLAH' | 'PERUSAHAAN' | 'APARTEMEN';

interface KategoriInfo {
  value: TipePendaftaran;
  icon: React.ReactNode;
  emoji: string;
  label: string;
  deskripsi: string;
  labelIdentitas: string;
  placeholderIdentitas: string;
  labelNama: string;
  placeholderNama: string;
  maxLengthIdentitas?: number;
}

const KATEGORI_LIST: KategoriInfo[] = [
  {
    value: 'RUMAH',
    icon: <Home className="w-6 h-6 text-emerald-500" />,
    emoji: '🏠',
    label: 'Rumah',
    deskripsi: 'Untuk rumah tangga / keluarga',
    labelIdentitas: 'NIK (Nomor Induk Kependudukan)',
    placeholderIdentitas: '3201234567890001',
    labelNama: 'Nama Perwakilan Rumah',
    placeholderNama: 'Bapak Budi Santoso',
    maxLengthIdentitas: 16,
  },
  {
    value: 'SEKOLAH',
    icon: <GraduationCap className="w-6 h-6 text-teal-500" />,
    emoji: '🏫',
    label: 'Sekolah',
    deskripsi: 'Untuk institusi pendidikan',
    labelIdentitas: 'NPSN (Nomor Pokok Sekolah Nasional)',
    placeholderIdentitas: '20100001',
    labelNama: 'Nama Sekolah',
    placeholderNama: 'SMA Negeri 1 Jakarta',
    maxLengthIdentitas: 8,
  },
  {
    value: 'PERUSAHAAN',
    icon: <Building2 className="w-6 h-6 text-emerald-600" />,
    emoji: '🏢',
    label: 'Perusahaan',
    deskripsi: 'Badan usaha / perkantoran',
    labelIdentitas: 'NIB (Nomor Induk Berusaha)',
    placeholderIdentitas: '1234567890123',
    labelNama: 'Nama Perusahaan',
    placeholderNama: 'PT Maju Jaya Abadi',
    maxLengthIdentitas: 13,
  },
  {
    value: 'APARTEMEN',
    icon: <Building className="w-6 h-6 text-cyan-600" />,
    emoji: '🏬',
    label: 'Apartemen',
    deskripsi: 'Pengelola gedung apartemen',
    labelIdentitas: 'Nama Pengelola / ID Apartemen',
    placeholderIdentitas: 'Kuningan City Tower A',
    labelNama: 'Nama Apartemen',
    placeholderNama: 'Apartemen Kuningan City',
  },
];

const initialState = { success: false, error: '' };

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedKategori, setSelectedKategori] = useState<TipePendaftaran | null>(null);

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await register(formData);
      return result ?? initialState;
    },
    initialState
  );

  const kategori = KATEGORI_LIST.find((k) => k.value === selectedKategori);

  function handleSelectKategori(value: TipePendaftaran) {
    setSelectedKategori(value);
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl">
        <TiltCard tilt={true} className="p-7 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ── Step 1: Pilih Kategori ── */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/10">
                    <span className="text-3xl">♻️</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Daftar Akun Baru
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5">
                    Pilih kategori yang paling sesuai dengan profil Anda
                  </p>
                </div>

                {/* Grid Pilihan Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {KATEGORI_LIST.map((kat, index) => (
                    <motion.button
                      key={kat.value}
                      type="button"
                      onClick={() => handleSelectKategori(kat.value)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative p-5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-200 text-left flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {kat.icon}
                        </div>
                        <span className="text-xl">{kat.emoji}</span>
                      </div>

                      <div>
                        <span className="block font-bold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {kat.label}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {kat.deskripsi}
                        </span>
                      </div>

                      {/* Accent highlight border on hover */}
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500/0 group-hover:ring-emerald-500/20 transition-all pointer-events-none" />
                    </motion.button>
                  ))}
                </div>

                {/* Footer link */}
                <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Sudah punya akun?{' '}
                    <Link
                      href="/login"
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold hover:underline transition-all"
                    >
                      Masuk Sekarang
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ── Step 2: Form Registrasi ── */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                {kategori && (
                  <>
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/40 active:scale-95 transition-all shadow-sm"
                        aria-label="Ganti Kategori"
                        title="Ganti Kategori"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h1 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span>{kategori.emoji}</span>
                          <span>Daftar Kategori {kategori.label}</span>
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {kategori.deskripsi}
                        </p>
                      </div>
                    </div>

                    {/* Error message */}
                    {state.error && (
                      <div className="mb-5 p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-medium border border-rose-500/30 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{state.error}</span>
                      </div>
                    )}

                    <form action={formAction} className="space-y-4">
                      <input type="hidden" name="tipePendaftaran" value={kategori.value} />

                      {/* Identitas & Nama Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1">
                            {kategori.labelIdentitas}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <input
                              name="nomorIdentitas"
                              type="text"
                              required
                              maxLength={kategori.maxLengthIdentitas}
                              className="clay-input pl-10 py-2.5"
                              placeholder={kategori.placeholderIdentitas}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1">
                            {kategori.labelNama}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              name="nama"
                              type="text"
                              required
                              className="clay-input pl-10 py-2.5"
                              placeholder={kategori.placeholderNama}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email & No HP Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1">
                            Alamat Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              name="email"
                              type="email"
                              required
                              className="clay-input pl-10 py-2.5"
                              placeholder="nama@email.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1">
                            No. WhatsApp
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              name="noHp"
                              type="text"
                              required
                              className="clay-input pl-10 py-2.5"
                              placeholder="081234567890"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5 pl-1">
                          Kata Sandi
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="clay-input pl-10 py-2.5"
                            placeholder="Minimal 6 karakter"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-3">
                        <button
                          type="submit"
                          disabled={pending}
                          className="clay-btn w-full py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 group"
                        >
                          {pending ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Mendaftarkan Akun...
                            </span>
                          ) : (
                            <>
                              <span>Daftar sebagai {kategori.label}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </TiltCard>
      </div>
    </div>
  );
}
