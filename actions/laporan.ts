'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { StatusLaporan } from '@prisma/client';

// ─── Schema Validasi ──────────────────────────────────────────────────────────

const LaporanSchema = z.object({
  jenisSampahId: z.string().min(1, 'Jenis Sampah wajib dipilih'),
  wilayahId:     z.string().min(1, 'Wilayah wajib dipilih'),
  berat:         z.coerce.number().positive('Berat harus lebih besar dari 0'),
  alamatJemput:  z.string().optional(),
  deskripsi:     z.string().optional(),
  fotoUrl:       z.string().optional(), // URL langsung (bisa hasil upload atau link eksternal)
});

const VerifySchema = z.object({
  laporanId: z.string().min(1, 'ID Laporan wajib diisi'),
  status:    z.nativeEnum(StatusLaporan),
});

const SetorSchema = z.object({
  laporanId:     z.string().min(1, 'ID Laporan wajib diisi'),
  jenisSampahId: z.string().min(1, 'Jenis Sampah wajib dipilih'),
  beratKg:       z.coerce.number().positive('Berat harus lebih besar dari 0'),
});

// ─── createLaporan ────────────────────────────────────────────────────────────
// Dibuat oleh user: estimasi berat + foto + alamat penjemputan

export async function createLaporan(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const parsed = LaporanSchema.safeParse({
    jenisSampahId: formData.get('jenisSampahId'),
    wilayahId:     formData.get('wilayahId'),
    berat:         formData.get('berat'),
    alamatJemput:  formData.get('alamatJemput'),
    deskripsi:     formData.get('deskripsi'),
    fotoUrl:       formData.get('fotoUrl'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { jenisSampahId, wilayahId, berat, alamatJemput, deskripsi, fotoUrl } = parsed.data;

  try {
    const laporan = await prisma.$transaction(async (tx) => {
      const jenis = await tx.jenisSampah.findUniqueOrThrow({ where: { id: jenisSampahId } });

      // Hitung estimasi poin dari berat user (1 poin per 1000 nilai harga)
      const poinEstimasi = Math.floor((berat * jenis.hargaPerKg) / 1000);

      const newLaporan = await tx.laporanSampah.create({
        data: {
          userId:       session.userId,
          jenisSampahId,
          wilayahId,
          berat,
          alamatJemput: alamatJemput ?? null,
          deskripsi:    deskripsi ?? null,
          fotoUrl:      fotoUrl ?? null,
          poinDidapat:  poinEstimasi,
          status:       'PENDING',
        },
      });

      return newLaporan;
    });

    revalidatePath('/dashboard');
    return { success: true, data: { id: laporan.id } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data.';
    return { success: false, error: message };
  }
}

// ─── adminVerifyLaporan ───────────────────────────────────────────────────────
// Admin mengubah status laporan (DITERIMA, DIPROSES, DITOLAK)
// Untuk SELESAI, gunakan adminSetorSampah() di bawah

export async function adminVerifyLaporan(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'Akses ditolak. Hanya Admin yang dapat memverifikasi laporan.' };
  }

  const parsed = VerifySchema.safeParse({
    laporanId: formData.get('laporanId'),
    status:    formData.get('status'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { laporanId, status } = parsed.data;

  // SELESAI harus dilakukan via adminSetorSampah (butuh berat riil)
  if (status === 'SELESAI') {
    return { success: false, error: 'Untuk menyelesaikan laporan, gunakan form "Setor Sampah" yang mewajibkan input berat aktual.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const laporan = await tx.laporanSampah.findUniqueOrThrow({ where: { id: laporanId } });

      if (laporan.status === 'SELESAI' || laporan.status === 'DITOLAK') {
        throw new Error('Laporan yang sudah selesai atau ditolak tidak dapat diubah lagi.');
      }

      await tx.laporanSampah.update({ where: { id: laporanId }, data: { status } });

      if (status === 'DITOLAK') {
        await tx.notifikasi.create({
          data: {
            userId: laporan.userId,
            judul:  'Laporan Ditolak',
            pesan:  `Laporan sampah seberat ${laporan.berat}kg telah ditolak oleh Admin.`,
            type:   'ERROR',
          },
        });
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan.';
    return { success: false, error: message };
  }
}

// ─── adminSetorSampah ─────────────────────────────────────────────────────────
// Admin input berat aktual & jenis sampah → hitung poin riil → update saldo user
// Menggunakan BEGIN ... COMMIT (Prisma $transaction) secara atomik

export async function adminSetorSampah(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'Akses ditolak. Hanya Admin yang dapat memproses setoran.' };
  }

  const parsed = SetorSchema.safeParse({
    laporanId:     formData.get('laporanId'),
    jenisSampahId: formData.get('jenisSampahId'),
    beratKg:       formData.get('beratKg'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { laporanId, jenisSampahId, beratKg } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Ambil data laporan (pastikan masih bisa diproses)
      const laporan = await tx.laporanSampah.findUniqueOrThrow({ where: { id: laporanId } });

      if (laporan.status === 'SELESAI' || laporan.status === 'DITOLAK') {
        throw new Error('Laporan ini sudah selesai atau ditolak, tidak bisa diproses ulang.');
      }

      // Cek apakah sudah ada transaksi setor (idempoten)
      const existing = await tx.transaksiSetor.findUnique({ where: { laporanId } });
      if (existing) {
        throw new Error('Transaksi setor untuk laporan ini sudah pernah dibuat.');
      }

      // 2. Ambil harga jenis sampah yang dipilih admin
      const jenis = await tx.jenisSampah.findUniqueOrThrow({ where: { id: jenisSampahId } });

      // 3. Hitung poin aktual: totalPoin = beratKg * hargaPerKg / 1000
      const totalPoin = Math.floor((beratKg * jenis.hargaPerKg) / 1000);

      // 4. Buat record TransaksiSetor
      await tx.transaksiSetor.create({
        data: {
          laporanId,
          adminId:       session.userId,
          jenisSampahId,
          beratKg,
          totalPoin,
        },
      });

      // 5. Update laporan: status SELESAI + poin aktual
      await tx.laporanSampah.update({
        where: { id: laporanId },
        data: {
          status:      'SELESAI',
          poinDidapat: totalPoin,
        },
      });

      // 6. Tambah saldo poin user secara atomik
      await tx.user.update({
        where: { id: laporan.userId },
        data: { poin: { increment: totalPoin } },
      });

      // 7. Buat notifikasi untuk user
      await tx.notifikasi.create({
        data: {
          userId: laporan.userId,
          judul:  '🎉 Laporan Disetujui & Poin Ditambahkan!',
          pesan:  `Laporan sampah ${jenis.namaJenis} seberat ${beratKg}kg telah diverifikasi. Kamu mendapatkan ${totalPoin} poin!`,
          type:   'SUCCESS',
        },
      });
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan.';
    return { success: false, error: message };
  }
}
