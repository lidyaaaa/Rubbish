'use client';

import { useEffect, useState, useActionState } from 'react';
import { adminSetorSampah } from '@/actions/laporan';
import { toast } from 'sonner';

interface JenisSampah { id: string; namaJenis: string; hargaPerKg: number; }

interface Props {
  laporanId:    string;
  namaUser:     string;
  estimasiBerat: number;
  defaultJenisSampahId?: string;
  jenisSampah:  JenisSampah[];
  onClose:      () => void;
}

interface FormState { success: boolean; error?: string; }
const initialState: FormState = { success: false };

export default function AdminSetorModal({ laporanId, namaUser, estimasiBerat, defaultJenisSampahId, jenisSampah, onClose }: Props) {
  const [selectedJenisId, setSelectedJenisId] = useState<string>(defaultJenisSampahId || '');
  const [beratAktual, setBeratAktual]         = useState<number>(estimasiBerat);

  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      return adminSetorSampah(formData);
    },
    initialState
  );

  const selectedJenis = jenisSampah.find((j) => j.id === selectedJenisId);
  const hargaPerKg = selectedJenis?.hargaPerKg ?? 0;
  const poinAktual = Math.floor((beratAktual * hargaPerKg) / 1000);

  useEffect(() => {
    if (state.success) {
      toast.success('✅ Sampah berhasil disetor! Poin user telah diperbarui.');
      onClose();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-clay-surface dark:bg-clay-surface-dark shadow-clay dark:shadow-clay-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">⚖️ Setor Sampah</h2>
            <p className="text-xs text-clay-muted mt-0.5">Oleh: {namaUser}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-clay-bg dark:hover:bg-clay-bg-dark transition-all text-lg font-bold">
            ✕
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          <input type="hidden" name="laporanId" value={laporanId} />

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              📊 Estimasi dari user: <strong>{estimasiBerat} kg</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jenis Sampah <span className="text-red-400">*</span>
            </label>
            <select 
              name="jenisSampahId" 
              required 
              className="clay-input"
              value={selectedJenisId}
              onChange={(e) => setSelectedJenisId(e.target.value)}
            >
              <option value="">Pilih jenis sampah...</option>
              {jenisSampah.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaJenis} — {j.hargaPerKg.toLocaleString('id-ID')} poin/kg
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">
                Berat Aktual (Kg) <span className="text-red-400">*</span>
              </label>
              <input
                name="beratKg" type="number" step="0.01" min="0.01"
                required className="clay-input w-full bg-white dark:bg-black/20"
                placeholder="Contoh: 2.35"
                value={beratAktual || ''}
                onChange={(e) => setBeratAktual(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="shrink-0 text-right sm:text-left sm:pl-4 sm:border-l border-emerald-200 dark:border-emerald-800/50">
              <p className="text-xs font-semibold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-wider mb-1">Poin Didapat</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {poinAktual.toLocaleString('id-ID')} <span className="text-sm font-bold">pts</span>
              </p>
            </div>
          </div>

          {/* Info kalkulasi */}
          <p className="text-xs text-clay-muted">
            💡 Poin = Berat Aktual × Poin/Kg ÷ 1000. Hasilnya akan ditambahkan ke saldo user secara otomatis.
          </p>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="clay-btn clay-btn-secondary flex-1">
              Batal
            </button>
            <button type="submit" disabled={pending} className="clay-btn flex-1">
              {pending ? '⏳ Memproses...' : '✅ Konfirmasi Setor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
