'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { createLaporan } from '@/actions/laporan';
import { toast } from 'sonner';

interface JenisSampah { id: string; namaJenis: string; hargaPerKg: number; }
interface Wilayah     { id: string; namaWilayah: string; }

interface Props {
  jenisSampah: JenisSampah[];
  wilayah:     Wilayah[];
  onClose:     () => void;
}

interface FormState {
  success: boolean;
  error?:  string;
  data?:   { id: string };
}

const initialState: FormState = { success: false };

export default function LaporanModal({ jenisSampah, wilayah, onClose }: Props) {
  const [fotoMode,    setFotoMode]    = useState<'url' | 'upload'>('url');
  const [previewUrl,  setPreviewUrl]  = useState<string>('');
  const [uploading,   setUploading]   = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedJenisId, setSelectedJenisId] = useState<string>('');
  const [estimasiBerat, setEstimasiBerat]     = useState<number>(0);

  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      if (fotoMode === 'upload' && uploadedUrl) {
        formData.set('fotoUrl', uploadedUrl);
      }
      return createLaporan(formData);
    },
    initialState
  );

  // Hitung poin secara realtime
  const selectedJenis = jenisSampah.find((j) => j.id === selectedJenisId);
  const hargaPerKg = selectedJenis?.hargaPerKg ?? 0;
  const estimasiPoin = Math.floor((estimasiBerat * hargaPerKg) / 1000);

  useEffect(() => {
    if (state.success) {
      toast.success('✅ Laporan berhasil dibuat!');
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json() as { url?: string; error?: string };

      if (!res.ok || json.error) {
        toast.error(json.error ?? 'Gagal mengunggah foto.');
        setPreviewUrl('');
        setUploadedUrl('');
      } else {
        setUploadedUrl(json.url ?? '');
        toast.success('Foto berhasil diunggah!');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah foto.');
      setPreviewUrl('');
      setUploadedUrl('');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-clay-surface dark:bg-clay-surface-dark shadow-clay dark:shadow-clay-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">📝 Buat Laporan Baru</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-clay-bg dark:hover:bg-clay-bg-dark transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="">Pilih jenis...</option>
                {jenisSampah.map((j) => (
                  <option key={j.id} value={j.id}>{j.namaJenis}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wilayah <span className="text-red-400">*</span>
              </label>
              <select name="wilayahId" required className="clay-input">
                <option value="">Pilih wilayah...</option>
                {wilayah.map((w) => (
                  <option key={w.id} value={w.id}>{w.namaWilayah}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">
                Estimasi Berat (Kg) <span className="text-red-400">*</span>
              </label>
              <input
                name="berat" type="number" step="0.1" min="0.1" required
                className="clay-input w-full bg-white dark:bg-black/20" placeholder="Contoh: 2.5"
                value={estimasiBerat || ''}
                onChange={(e) => setEstimasiBerat(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="shrink-0 text-right sm:text-left sm:pl-4 sm:border-l border-emerald-200 dark:border-emerald-800/50">
              <p className="text-xs font-semibold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-wider mb-1">Estimasi Poin</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {estimasiPoin.toLocaleString('id-ID')} <span className="text-sm font-bold">pts</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alamat Penjemputan
            </label>
            <input
              name="alamatJemput" type="text"
              className="clay-input" placeholder="Jl. Contoh No. 123, RT 01/RW 02, Kelurahan..."
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deskripsi
            </label>
            <textarea name="deskripsi" rows={2} className="clay-input" placeholder="Deskripsi singkat kondisi sampah..." />
          </div>

          {/* Foto: Tab Upload vs URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bukti Foto (opsional)
            </label>

            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-3 w-fit">
              <button
                type="button"
                onClick={() => { setFotoMode('url'); setPreviewUrl(''); setUploadedUrl(''); }}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  fotoMode === 'url'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-clay-bg dark:bg-clay-bg-dark text-gray-600 dark:text-gray-400'
                }`}
              >
                🔗 Tempel URL
              </button>
              <button
                type="button"
                onClick={() => { setFotoMode('upload'); setPreviewUrl(''); setUploadedUrl(''); }}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  fotoMode === 'upload'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-clay-bg dark:bg-clay-bg-dark text-gray-600 dark:text-gray-400'
                }`}
              >
                📁 Upload File
              </button>
            </div>

            {fotoMode === 'url' ? (
              <input
                name="fotoUrl" type="url"
                className="clay-input"
                placeholder="https://example.com/foto-sampah.jpg"
                onChange={(e) => setPreviewUrl(e.target.value)}
              />
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="clay-btn clay-btn-secondary w-full"
                >
                  {uploading ? '⏳ Mengunggah...' : '📁 Pilih File Gambar'}
                </button>
                {/* Hidden field untuk menyimpan URL hasil upload */}
                <input type="hidden" name="fotoUrl" value={uploadedUrl} />
                {uploading && (
                  <p className="text-xs text-clay-muted mt-2 text-center">Sedang mengunggah foto...</p>
                )}
              </div>
            )}

            {/* Preview foto */}
            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border-2 border-emerald-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl} alt="Preview foto"
                  className="w-full max-h-48 object-cover"
                  onError={() => setPreviewUrl('')}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={pending || uploading} className="clay-btn w-full mt-2">
            {pending ? '⏳ Mengirim...' : '📤 Kirim Laporan'}
          </button>
        </form>
      </div>
    </div>
  );
}
