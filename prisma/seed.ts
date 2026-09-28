import { Role, TipePendaftaran, KategoriReward } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Jenis Sampah
  const jenisPlastik = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Plastik' },
    update: {},
    create: { namaJenis: 'Plastik', deskripsi: 'Botol plastik, kemasan, kantong kresek', hargaPerKg: 2000 },
  });

  const jenisKertas = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Kertas' },
    update: {},
    create: { namaJenis: 'Kertas', deskripsi: 'Koran, kardus, HVS, buku bekas', hargaPerKg: 1500 },
  });

  const jenisLogam = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Logam' },
    update: {},
    create: { namaJenis: 'Logam', deskripsi: 'Kaleng aluminium, besi tua, tembaga', hargaPerKg: 3000 },
  });

  const jenisKaca = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Kaca' },
    update: {},
    create: { namaJenis: 'Kaca', deskripsi: 'Botol kaca, pecahan kaca daur ulang', hargaPerKg: 1000 },
  });

  const jenisElektronik = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Elektronik' },
    update: {},
    create: { namaJenis: 'Elektronik', deskripsi: 'Barang elektronik bekas (e-waste)', hargaPerKg: 5000 },
  });

  // 2. Wilayah
  const wilayahPusat = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Jakarta Pusat' },
    update: {},
    create: { namaWilayah: 'Jakarta Pusat', kodeWilayah: 'JKT-PST' },
  });

  const wilayahSelatan = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Jakarta Selatan' },
    update: {},
    create: { namaWilayah: 'Jakarta Selatan', kodeWilayah: 'JKT-SLT' },
  });

  const wilayahDepok = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Depok' },
    update: {},
    create: { namaWilayah: 'Depok', kodeWilayah: 'DPK' },
  });

  // 3. Users
  const user1 = await prisma.user.upsert({
    where: { email: 'budi@example.com' },
    update: {},
    create: {
      nomorIdentitas: '1234567890123456',
      nama: 'Budi Santoso',
      email: 'budi@example.com',
      noHp: '081234567890',
      password: hashedPassword,
      tipePendaftaran: TipePendaftaran.RUMAH,
      role: Role.USER,
      poin: 150,
    },
  });

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      nomorIdentitas: '1234567890123',
      nama: 'PT Rubbish Indonesia',
      email: 'admin@example.com',
      noHp: '088888888888',
      password: hashedPassword,
      tipePendaftaran: TipePendaftaran.PERUSAHAAN,
      role: Role.ADMIN,
      poin: 0,
    },
  });

  // 4. Rewards (dengan gambarUrl)
  await prisma.reward.deleteMany({}); // bersihkan reward lama
  
  const reward1 = await prisma.reward.create({
    data: {
      nama: 'Voucher Belanja Rp 25.000',
      deskripsi: 'Voucher belanja di minimarket terdekat. Berlaku 30 hari.',
      poinDibutuhkan: 25,
      stok: 20,
      kategoriReward: KategoriReward.VOUCHER,
      gambarUrl: 'https://placehold.co/400x300/10b981/white?text=Voucher+25K',
    },
  });

  const reward2 = await prisma.reward.create({
    data: {
      nama: 'Voucher Belanja Rp 50.000',
      deskripsi: 'Voucher belanja di supermarket partner.',
      poinDibutuhkan: 50,
      stok: 10,
      kategoriReward: KategoriReward.VOUCHER,
      gambarUrl: 'https://placehold.co/400x300/0d9488/white?text=Voucher+50K',
    },
  });

  const reward3 = await prisma.reward.create({
    data: {
      nama: 'Tumbler Eco 500ml',
      deskripsi: 'Botol minum stainless steel ramah lingkungan.',
      poinDibutuhkan: 30,
      stok: 15,
      kategoriReward: KategoriReward.PRODUK,
      gambarUrl: 'https://placehold.co/400x300/0891b2/white?text=Tumbler+Eco',
    },
  });

  const reward4 = await prisma.reward.create({
    data: {
      nama: 'Donasi 1 Pohon',
      deskripsi: 'Donasi penanaman 1 pohon di area hijau kota.',
      poinDibutuhkan: 10,
      stok: 100,
      kategoriReward: KategoriReward.DONASI,
      gambarUrl: 'https://placehold.co/400x300/65a30d/white?text=Tanam+Pohon',
    },
  });

  console.log('✅ Seed berhasil!');
  console.log({ jenisPlastik, jenisKertas, jenisLogam, jenisKaca, jenisElektronik });
  console.log({ wilayahPusat, wilayahSelatan, wilayahDepok });
  console.log({ user1, admin1 });
  console.log({ reward1, reward2, reward3, reward4 });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
