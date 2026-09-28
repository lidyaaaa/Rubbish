'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Lightbox from '@/components/Lightbox';
import LaporanModal from './LaporanModal';

interface JenisSampah { id: string; namaJenis: string; hargaPerKg: number; }
interface Wilayah     { id: string; namaWilayah: string; }

interface Laporan {
  id:          string;
  berat:       number;
  fotoUrl:     string | null;
  alamatJemput: string | null;
  deskripsi:   string | null;
  status:      string;
  prioritas:   string;
  poinDidapat: number;
  tanggalLapor: Date;
  jenisSampah: { namaJenis: string };
  wilayah:     { namaWilayah: string };
}

interface Props {
  user:        { nama: string; poin: number; tipePendaftaran: string };
  laporanList: Laporan[];
  jenisSampah: JenisSampah[];
  wilayah:     Wilayah[];
}

function statusToVariant(status: string): 'pending' | 'success' | 'warning' | 'error' | 'info' {
  const map: Record<string, 'pending' | 'success' | 'warning' | 'error' | 'info'> = {
    PENDING:  'pending',
    DITERIMA: 'info',
    DIPROSES: 'warning',
    SELESAI:  'success',
    DITOLAK:  'error',
  };
  return map[status] ?? 'info';
}

export default function UserDashboard({ user, laporanList, jenisSampah, wilayah }: Props) {
  const [showModal, setShowModal]   = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const totalSelesai = laporanList.filter((l) => l.status === 'SELESAI').length;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* ── Header / Intro ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Halo, {user.nama.split(' ')[0]}! 👋
          </h1>
          <p className="text-clay-muted dark:text-clay-muted-dark mt-1">
            Pantau aktivitasmu dan kelola sampah dengan lebih baik hari ini.
          </p>
        </div>
        <Badge variant="neutral" className="px-3 py-1.5 text-sm">{user.tipePendaftaran}</Badge>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="stat-card flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg dark:shadow-clay-dark-sm border-0">
          <div className="absolute -right-8 -top-8 text-[120px] opacity-10">💎</div>
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium">Total Poin Terkumpul</p>
            <div className="flex items-end gap-2 mt-2">
              <p className="text-4xl font-extrabold drop-shadow-sm">{user.poin.toLocaleString('id-ID')}</p>
              <p className="text-emerald-100 font-medium mb-1">Poin</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <p className="text-clay-muted dark:text-clay-muted-dark text-sm font-medium">Laporan Selesai</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{totalSelesai}</p>
            <p className="text-clay-muted dark:text-clay-muted-dark font-medium mb-1">/ {laporanList.length} Total Laporan</p>
          </div>
        </div>
      </div>

      <div className="clay-divider" />

      {/* ── Riwayat Laporan ── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">📋 Riwayat Laporan</h2>
          <button onClick={() => setShowModal(true)} className="clay-btn py-2.5">
            <span className="text-lg">+</span> Buat Laporan Baru
          </button>
        </div>

        {laporanList.length === 0 ? (
          <div className="text-center py-16 px-4 bg-clay-surface dark:bg-clay-surface-dark rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-700">
            <span className="text-5xl block mb-4">🌱</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Belum ada laporan</h3>
            <p className="text-clay-muted dark:text-clay-muted-dark mb-6">Mulai kontribusimu dengan melaporkan sampah pertamamu.</p>
            <button onClick={() => setShowModal(true)} className="clay-btn-secondary px-6 py-2.5 rounded-xl font-semibold shadow-clay-xs hover:shadow-clay-sm transition-all text-sm">
              Buat Laporan Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {laporanList.map((laporan) => (
              <div key={laporan.id} className="laporan-item flex-col sm:flex-row">
                
                {/* Thumbnail */}
                <div className="flex gap-4 w-full sm:w-auto">
                  {laporan.fotoUrl ? (
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(laporan.fotoUrl!)}
                      className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 focus:border-emerald-500 transition-all cursor-zoom-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={laporan.fotoUrl} alt="Foto sampah" className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                  
                  {/* Mobile header (shows on small, hidden on sm) */}
                  <div className="sm:hidden flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-800 dark:text-gray-100">{laporan.jenisSampah.namaJenis}</span>
                    </div>
                    <Badge dot variant={statusToVariant(laporan.status)}>{laporan.status}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="hidden sm:flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{laporan.jenisSampah.namaJenis}</span>
                      <Badge dot variant={statusToVariant(laporan.status)}>{laporan.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-0.5">
                      {laporan.berat} kg • {laporan.wilayah.namaWilayah}
                    </p>
                    {laporan.alamatJemput && (
                      <p className="text-xs text-clay-muted dark:text-clay-muted-dark truncate">📍 {laporan.alamatJemput}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                    <span className="text-xs font-medium text-clay-muted dark:text-clay-muted-dark">
                      {new Date(laporan.tanggalLapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-emerald-500">+{laporan.poinDidapat}</span>
                      <span className="text-[10px] font-bold text-clay-muted uppercase tracking-wider">Poin</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <LaporanModal jenisSampah={jenisSampah} wilayah={wilayah} onClose={() => setShowModal(false)} />}
      {lightboxUrl && <Lightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
}
