'use client';

import { adminVerifyLaporan } from '@/actions/laporan';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function AdminActionButtons({ laporanId }: { laporanId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleVerify(status: 'DITERIMA' | 'DIPROSES' | 'DITOLAK') {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('laporanId', laporanId);
      formData.append('status', status);
      const result = await adminVerifyLaporan(formData);
      if (result.success) {
        toast.success(`Status laporan diubah ke ${status}`);
      } else {
        toast.error(result.error ?? 'Terjadi kesalahan.');
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => handleVerify('DITERIMA')}
        disabled={isPending}
        className="px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-clay-sm hover:shadow-clay disabled:opacity-50 transition-all"
      >
        Terima
      </button>
      <button
        onClick={() => handleVerify('DIPROSES')}
        disabled={isPending}
        className="px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-clay-sm hover:shadow-clay disabled:opacity-50 transition-all"
      >
        Proses
      </button>
      <button
        onClick={() => handleVerify('DITOLAK')}
        disabled={isPending}
        className="px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-clay-sm hover:shadow-clay disabled:opacity-50 transition-all"
      >
        Tolak
      </button>
    </div>
  );
}
