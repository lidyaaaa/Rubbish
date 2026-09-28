'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const RedeemSchema = z.object({
  rewardId: z.string().min(1, 'Reward ID wajib diisi'),
});

export async function redeemReward(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const parsed = RedeemSchema.safeParse({
    rewardId: formData.get('rewardId'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { rewardId } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUniqueOrThrow({
        where: { id: rewardId },
      });

      if (reward.stok <= 0) {
        throw new Error('Stok reward sudah habis.');
      }

      const user = await tx.user.findUniqueOrThrow({
        where: { id: session.userId },
      });

      if (user.poin < reward.poinDibutuhkan) {
        throw new Error('Poin Anda tidak mencukupi.');
      }

      await tx.user.update({
        where: { id: session.userId },
        data: { poin: { decrement: reward.poinDibutuhkan } },
      });

      await tx.reward.update({
        where: { id: rewardId },
        data: { stok: { decrement: 1 } },
      });

      await tx.rewardRedeem.create({
        data: {
          userId: session.userId,
          rewardId: rewardId,
          poinDigunakan: reward.poinDibutuhkan,
        },
      });

      await tx.notifikasi.create({
        data: {
          userId: session.userId,
          judul: 'Reward Ditukar!',
          pesan: `Anda berhasil menukarkan ${reward.nama} dengan ${reward.poinDibutuhkan} poin.`,
          type: 'SUCCESS',
        },
      });
    });

    revalidatePath('/redeem');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan.';
    return { success: false, error: message };
  }
}

export async function adminUpdateRedeemStatus(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'Akses ditolak.' };
  }

  const redeemId = formData.get('redeemId') as string;
  const status = formData.get('status') as any;

  if (!redeemId || !status) return { success: false, error: 'Data tidak lengkap.' };

  try {
    await prisma.rewardRedeem.update({
      where: { id: redeemId },
      data: { status },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal update status.' };
  }
}
