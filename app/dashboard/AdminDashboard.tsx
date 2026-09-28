'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Lightbox from '@/components/Lightbox';
import AdminSetorModal from './AdminSetorModal';
import { adminUpdateRedeemStatus } from '@/actions/reward';
import { toast } from 'sonner';

interface JenisSampah { id: string; namaJenis: string; hargaPerKg: number; }

interface Laporan {
  id:           string;
  berat:        number;
  fotoUrl:      string | null;
  alamatJemput: string | null;
  deskripsi:    string | null;
  status:       string;
  prioritas:    string;
  poinDidapat:  number;
  tanggalLapor: Date;
  jenisSampahId: string;
  jenisSampah:  { namaJenis: string };
  wilayah:      { namaWilayah: string };
  user:         { nama: string; email: string };
}

interface RewardRedeem {
  id: string;
  poinDigunakan: number;
  status: string;
  createdAt: Date;
  user: { nama: string; email: string };
  reward: { nama: string; };
}

interface Props {
  admin:       { nama: string; role: string };
  allLaporan:  Laporan[];
  jenisSampah: JenisSampah[];
  allRedeem:   RewardRedeem[];
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

export default function AdminDashboard({ admin, allLaporan, jenisSampah, allRedeem }: Props) {
  const [lightboxUrl, setLightboxUrl]       = useState<string | null>(null);
  const [setorTarget, setSetorTarget]       = useState<Laporan | null>(null);
  const [filter, setFilter]                 = useState<'ALL' | 'PENDING' | 'SELESAI'>('PENDING'); // default to pending for ease

  const totalPending  = allLaporan.filter((l) => l.status === 'PENDING' || l.status === 'DITERIMA' || l.status === 'DIPROSES').length;
  const totalSelesai  = allLaporan.filter((l) => l.status === 'SELESAI').length;

  const filteredLaporan = allLaporan.filter((l) => {
    if (filter === 'PENDING') return l.status === 'PENDING' || l.status === 'DITERIMA' || l.status === 'DIPROSES';
    if (filter === 'SELESAI') return l.status === 'SELESAI';
    return true;
  });

  async function handleRedeemStatus(redeemId: string, status: string) {
    const fd = new FormData();
    fd.append('redeemId', redeemId);
    fd.append('status', status);
    const res = await adminUpdateRedeemStatus(fd);
    if (res.success) toast.success('Status penukaran reward berhasil diubah!');
    else toast.error(res.error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      
      {/* ── Admin Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
              Admin Area
            </h1>
            <Badge variant="error" className="uppercase px-2.5 py-1">Super User</Badge>
          </div>
          <p className="text-clay-muted dark:text-clay-muted-dark font-medium">
            Selamat bekerja, {admin.nama}
          </p>
        </div>
      </div>

      {/* ── Admin Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="stat-card">
          <p className="text-clay-muted dark:text-clay-muted-dark text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Total Laporan</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100">{allLaporan.length}</p>
        </div>
        <div className="stat-card ring-1 ring-amber-500/20 bg-amber-50/30 dark:bg-amber-900/10 cursor-pointer hover:ring-amber-500/50" onClick={() => setFilter('PENDING')}>
          <p className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Perlu Diproses</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">{totalPending}</p>
        </div>
        <div className="stat-card ring-1 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/10 cursor-pointer hover:ring-emerald-500/50" onClick={() => setFilter('SELESAI')}>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">Selesai</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500">{totalSelesai}</p>
        </div>
      </div>

      <div className="clay-divider" />

      {/* ── Filter & List ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🛡️ Laporan Sampah Masuk
          </h2>
          
          <div className="flex p-1 rounded-xl bg-clay-bg dark:bg-clay-bg-dark border border-gray-200/50 dark:border-gray-800/50 shadow-clay-inset dark:shadow-clay-dark-inset self-start overflow-x-auto max-w-full">
            <button onClick={() => setFilter('ALL')} className={`tab-pill whitespace-nowrap ${filter === 'ALL' ? 'tab-pill-active' : 'tab-pill-inactive'}`}>
              Semua
            </button>
            <button onClick={() => setFilter('PENDING')} className={`tab-pill whitespace-nowrap ${filter === 'PENDING' ? 'tab-pill-active' : 'tab-pill-inactive'}`}>
              Perlu Diproses
            </button>
            <button onClick={() => setFilter('SELESAI')} className={`tab-pill whitespace-nowrap ${filter === 'SELESAI' ? 'tab-pill-active' : 'tab-pill-inactive'}`}>
              Selesai
            </button>
          </div>
        </div>

        {filteredLaporan.length === 0 ? (
          <div className="text-center py-16 px-4 bg-clay-surface dark:bg-clay-surface-dark rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-clay-muted dark:text-clay-muted-dark">Tidak ada laporan yang sesuai filter saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredLaporan.map((laporan) => {
              const isFinished = laporan.status === 'SELESAI' || laporan.status === 'DITOLAK';

              return (
                <div key={laporan.id} className={`laporan-item flex-col sm:flex-row relative overflow-hidden ${!isFinished ? 'ring-2 ring-emerald-400/50 shadow-md' : ''}`}>
                  
                  {!isFinished && <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />}

                  {/* Thumbnail Foto */}
                  <div className="flex gap-4 w-full sm:w-auto z-10">
                    {laporan.fotoUrl ? (
                      <button
                        type="button"
                        onClick={() => setLightboxUrl(laporan.fotoUrl!)}
                        className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all cursor-zoom-in shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={laporan.fotoUrl} alt="Foto sampah" className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl shadow-inner">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Info Laporan */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full z-10">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge dot variant={statusToVariant(laporan.status)} className="capitalize">{laporan.status.toLowerCase()}</Badge>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {new Date(laporan.tanggalLapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-0.5 leading-tight">
                        {laporan.jenisSampah.namaJenis} • {laporan.berat} kg
                      </h3>
                      
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Oleh: <span className="text-gray-800 dark:text-gray-100">{laporan.user.nama}</span>
                      </p>

                      <div className="mt-2 space-y-1">
                        {laporan.alamatJemput && (
                          <p className="text-xs text-clay-muted dark:text-clay-muted-dark truncate" title={laporan.alamatJemput}>
                            📍 {laporan.alamatJemput}
                          </p>
                        )}
                        {laporan.deskripsi && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                            &ldquo;{laporan.deskripsi}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-3">
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">~{laporan.poinDidapat}</span>
                        <span className="text-[10px] font-bold text-clay-muted uppercase tracking-wider">Est. Poin</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isFinished && (
                          <button
                            type="button"
                            onClick={() => setSetorTarget(laporan)}
                            className="px-4 py-2 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-clay-sm hover:shadow-clay hover:-translate-y-0.5 transition-all"
                          >
                            ✅ Konfirmasi Setor
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="clay-divider" />

      {/* ── Manajemen Reward Redeem ── */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🎁 Riwayat Klaim Reward User
        </h2>
        {allRedeem.length === 0 ? (
          <div className="text-center py-10 px-4 bg-clay-surface dark:bg-clay-surface-dark rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-clay-muted dark:text-clay-muted-dark">Belum ada user yang mengklaim reward.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allRedeem.map((r) => (
              <Card key={r.id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{r.reward.nama}</h3>
                    <p className="text-sm text-clay-muted dark:text-clay-muted-dark mb-1">Klaim oleh: <strong>{r.user.nama}</strong></p>
                    <p className="text-xs text-clay-muted dark:text-clay-muted-dark">
                      Tanggal: {new Date(r.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Badge variant={r.status === 'PENDING' ? 'pending' : r.status === 'DIKIRIM' || r.status === 'DIPROSES' ? 'info' : r.status === 'SELESAI' ? 'success' : 'error'}>
                    {r.status}
                  </Badge>
                </div>
                {r.status === 'PENDING' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button onClick={() => handleRedeemStatus(r.id, 'DIKIRIM')} className="flex-1 py-1.5 px-3 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Kirim Reward
                    </button>
                    <button onClick={() => handleRedeemStatus(r.id, 'SELESAI')} className="flex-1 py-1.5 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      Selesai
                    </button>
                  </div>
                )}
                {r.status === 'DIKIRIM' && (
                  <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button onClick={() => handleRedeemStatus(r.id, 'SELESAI')} className="w-full py-1.5 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      Tandai Selesai
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {setorTarget && (
        <AdminSetorModal
          laporanId={setorTarget.id}
          namaUser={setorTarget.user.nama}
          estimasiBerat={setorTarget.berat}
          defaultJenisSampahId={setorTarget.jenisSampahId}
          jenisSampah={jenisSampah}
          onClose={() => setSetorTarget(null)}
        />
      )}

      {lightboxUrl && <Lightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
}
