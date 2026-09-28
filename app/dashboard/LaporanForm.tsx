'use client';

import { createLaporan } from '@/actions/laporan';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface JenisSampah {
  id: string;
  namaJenis: string;
}

interface Wilayah {
  id: string;
  namaWilayah: string;
}

interface Props {
  jenisSampah: JenisSampah[];
  wilayah: Wilayah[];
}

interface FormState {
  success: boolean;
  error?: string;
  data?: { id: string };
}

const initialState: FormState = { success: false };

export default function LaporanForm({ jenisSampah, wilayah }: Props) {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createLaporan(formData);
      return result;
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success('Laporan berhasil dibuat!');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="jenisSampahId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Jenis Sampah
        </label>
        <select id="jenisSampahId" name="jenisSampahId" required className="clay-input">
          <option value="">Pilih jenis...</option>
          {jenisSampah.map((j) => (
            <option key={j.id} value={j.id}>{j.namaJenis}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="wilayahId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Wilayah
        </label>
        <select id="wilayahId" name="wilayahId" required className="clay-input">
          <option value="">Pilih wilayah...</option>
          {wilayah.map((w) => (
            <option key={w.id} value={w.id}>{w.namaWilayah}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="berat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Berat (Kg)
        </label>
        <input id="berat" name="berat" type="number" step="0.1" min="0.1" required className="clay-input" placeholder="Contoh: 2.5" />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL Foto (opsional)
        </label>
        <input id="imageUrl" name="imageUrl" type="url" className="clay-input" placeholder="https://example.com/foto.jpg" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Deskripsi
        </label>
        <textarea id="deskripsi" name="deskripsi" rows={2} className="clay-input" placeholder="Deskripsi singkat..." />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="clay-btn w-full">
          {pending ? 'Mengirim...' : '📤 Kirim Laporan'}
        </button>
      </div>
    </form>
  );
}
