'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TipePendaftaran } from '@prisma/client';

// Konfigurasi per kategori pendaftaran
const KATEGORI_CONFIG: Record<
  TipePendaftaran,
  {
    labelIdentitas: string;
    labelNama: string;
    validateIdentitas: (val: string) => boolean;
    errorIdentitas: string;
  }
> = {
  RUMAH: {
    labelIdentitas: 'NIK (Nomor Induk Kependudukan)',
    labelNama: 'Nama Perwakilan Rumah',
    validateIdentitas: (val) => /^\d{16}$/.test(val),
    errorIdentitas: 'NIK harus tepat 16 digit angka',
  },
  SEKOLAH: {
    labelIdentitas: 'NPSN (Nomor Pokok Sekolah Nasional)',
    labelNama: 'Nama Sekolah',
    validateIdentitas: (val) => /^\d{8}$/.test(val),
    errorIdentitas: 'NPSN harus tepat 8 digit angka',
  },
  PERUSAHAAN: {
    labelIdentitas: 'NIB (Nomor Induk Berusaha)',
    labelNama: 'Nama Perusahaan',
    validateIdentitas: (val) => /^\d{13}$/.test(val),
    errorIdentitas: 'NIB harus tepat 13 digit angka',
  },
  APARTEMEN: {
    labelIdentitas: 'Nama Apartemen',
    labelNama: 'Nama Apartemen',
    validateIdentitas: (val) => val.length >= 3,
    errorIdentitas: 'Nama apartemen minimal 3 karakter',
  },
};

const BaseRegisterSchema = z.object({
  tipePendaftaran: z.nativeEnum(TipePendaftaran, {
    message: 'Pilih kategori pendaftaran yang valid',
  }),
  nomorIdentitas: z.string().min(1, 'Nomor identitas wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  noHp: z.string().min(10, 'Nomor HP minimal 10 digit'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export async function register(formData: FormData) {
  const parsed = BaseRegisterSchema.safeParse({
    tipePendaftaran: formData.get('tipePendaftaran'),
    nomorIdentitas: formData.get('nomorIdentitas'),
    nama: formData.get('nama'),
    email: formData.get('email'),
    noHp: formData.get('noHp'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { tipePendaftaran, nomorIdentitas, nama, email, noHp, password } = parsed.data;

  // Validasi identitas sesuai kategori
  const config = KATEGORI_CONFIG[tipePendaftaran];
  if (!config.validateIdentitas(nomorIdentitas)) {
    return { success: false, error: config.errorIdentitas };
  }

  // Cek duplikat
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { nomorIdentitas }, { noHp }] },
  });

  if (exists) {
    return { success: false, error: 'Email, Nomor Identitas, atau No HP sudah terdaftar.' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      nomorIdentitas,
      nama,
      email,
      noHp,
      password: hashed,
      tipePendaftaran,
    },
  });

  redirect('/login?registered=true');
}

export async function login(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: 'Email atau password salah.' };
  }

  const token = await createJwt({ userId: user.id, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}

// Export config agar bisa dipakai di client component
export async function getKategoriConfig() {
  return Object.entries(KATEGORI_CONFIG).map(([key, val]) => ({
    value: key as TipePendaftaran,
    labelIdentitas: val.labelIdentitas,
    labelNama: val.labelNama,
    errorIdentitas: val.errorIdentitas,
  }));
}
