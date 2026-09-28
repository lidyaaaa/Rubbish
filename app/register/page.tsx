'use client';

import { register } from '@/actions/auth';
import Link from 'next/link';
import { useActionState, useState } from 'react';

type TipePendaftaran = 'RUMAH' | 'SEKOLAH' | 'PERUSAHAAN' | 'APARTEMEN';

interface KategoriInfo {
  value: TipePendaftaran;
  icon: string;
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
    icon: '🏠',
    label: 'Rumah',
    deskripsi: 'Untuk rumah tangga / keluarga',
    labelIdentitas: 'NIK KTP',
    placeholderIdentitas: '3201234567890001',
    labelNama: 'Nama Perwakilan Rumah',
    placeholderNama: 'Bapak Budi Santoso',
    maxLengthIdentitas: 16,
  },
  {
    value: 'SEKOLAH',
    icon: '🏫',
    label: 'Sekolah',
    deskripsi: 'Untuk institusi pendidikan',
    labelIdentitas: 'NPSN Sekolah',
    placeholderIdentitas: '20100001',
    labelNama: 'Nama Sekolah',
    placeholderNama: 'SMA Negeri 1 Jakarta',
    maxLengthIdentitas: 8,
  },
  {
    value: 'PERUSAHAAN',
    icon: '🏢',
    label: 'Perusahaan',
    deskripsi: 'Badan usaha / perusahaan',
    labelIdentitas: 'NIB Perusahaan',
    placeholderIdentitas: '1234567890123',
    labelNama: 'Nama Perusahaan',
    placeholderNama: 'PT Maju Jaya Abadi',
    maxLengthIdentitas: 13,
  },
  {
    value: 'APARTEMEN',
    icon: '🏬',
    label: 'Apartemen',
    deskripsi: 'Pengelola apartemen',
    labelIdentitas: 'Nama Identitas Apartemen',
    placeholderIdentitas: 'Kuningan City',
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
    setSelectedKategori(null);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-80px)]">
      <div className="max-w-xl w-full">
        {/* Step 1: Pilih Kategori */}
        <div
          className={`transition-all duration-300 ease-out ${
            step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute pointer-events-none'
          }`}
        >
          <div className="p-8 sm:p-10 rounded-[2rem] bg-clay-card dark:bg-clay-card-dark shadow-clay dark:shadow-clay-dark relative overflow-hidden">
            <div className="text-center mb-8 relative z-10">
              <span className="text-4xl block mb-3">♻️</span>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                Daftar Akun Baru
              </h1>
              <p className="text-clay-muted dark:text-clay-muted-dark text-sm mt-1.5">
                Pilih kategori yang paling sesuai dengan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {KATEGORI_LIST.map((kat) => (
                <button
                  key={kat.value}
                  type="button"
                  onClick={() => handleSelectKategori(kat.value)}
                  className="group relative p-5 rounded-2xl bg-clay-surface dark:bg-clay-surface-dark shadow-clay-xs dark:shadow-clay-dark-xs hover:shadow-clay-sm dark:hover:shadow-clay-dark-sm transition-all duration-200 hover:-translate-y-1 text-left flex flex-col gap-2"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform origin-left">{kat.icon}</span>
                  <div>
                    <span className="block font-bold text-gray-800 dark:text-gray-100">{kat.label}</span>
                    <span className="block text-xs text-clay-muted dark:text-clay-muted-dark mt-0.5">{kat.deskripsi}</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500/0 group-hover:ring-emerald-500/30 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center relative z-10">
              <p className="text-sm text-clay-muted dark:text-clay-muted-dark">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold transition-colors">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Form Registrasi */}
        <div
          className={`transition-all duration-300 ease-out ${
            step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute pointer-events-none'
          }`}
        >
          {kategori && (
            <div className="p-8 sm:p-10 rounded-[2rem] bg-clay-card dark:bg-clay-card-dark shadow-clay dark:shadow-clay-dark">
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-clay-surface dark:bg-clay-surface-dark shadow-clay-xs hover:shadow-clay-sm transition-all text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    {kategori.icon} Daftar {kategori.label}
                  </h1>
                  <p className="text-clay-muted dark:text-clay-muted-dark text-xs mt-0.5">{kategori.deskripsi}</p>
                </div>
              </div>

              {state.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800/30 text-center">
                  {state.error}
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="tipePendaftaran" value={kategori.value} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">
                      {kategori.labelIdentitas}
                    </label>
                    <input name="nomorIdentitas" type="text" required maxLength={kategori.maxLengthIdentitas} className="clay-input py-2.5" placeholder={kategori.placeholderIdentitas} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">
                      {kategori.labelNama}
                    </label>
                    <input name="nama" type="text" required className="clay-input py-2.5" placeholder={kategori.placeholderNama} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Email</label>
                    <input name="email" type="email" required className="clay-input py-2.5" placeholder="nama@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">No. WhatsApp</label>
                    <input name="noHp" type="text" required className="clay-input py-2.5" placeholder="081234567890" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 pl-1">Kata Sandi</label>
                  <input name="password" type="password" required minLength={6} className="clay-input py-2.5" placeholder="Minimal 6 karakter" />
                </div>

                <button type="submit" disabled={pending} className="clay-btn w-full py-3.5 mt-4 text-base">
                  {pending ? 'Memproses Pendaftaran...' : `Daftar sebagai ${kategori.label}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
