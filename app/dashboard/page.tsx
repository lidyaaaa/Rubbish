import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN';

  if (isAdmin) {
    // ── Admin: ambil semua laporan + jenis sampah + reward redeem ──
    const [admin, allLaporan, jenisSampah, allRedeem] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.userId } }),
      prisma.laporanSampah.findMany({
        include: {
          jenisSampah: true,
          wilayah:     true,
          user:        true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.jenisSampah.findMany({ orderBy: { namaJenis: 'asc' } }),
      prisma.rewardRedeem.findMany({
        include: { user: true, reward: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!admin) redirect('/login');

    return (
      <div className="p-6">
        <AdminDashboard
          admin={{ nama: admin.nama, role: admin.role }}
          allLaporan={allLaporan}
          jenisSampah={jenisSampah}
          allRedeem={allRedeem}
        />
      </div>
    );
  }

  // ── User: ambil data miliknya sendiri ──
  const [user, laporanList, jenisSampah, wilayah] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.laporanSampah.findMany({
      where:   { userId: session.userId },
      include: { jenisSampah: true, wilayah: true },
      orderBy: { createdAt: 'desc' },
      take:    20,
    }),
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: 'asc' } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: 'asc' } }),
  ]);

  if (!user) redirect('/login');

  return (
    <div className="p-6">
      <UserDashboard
        user={{ nama: user.nama, poin: user.poin, tipePendaftaran: user.tipePendaftaran }}
        laporanList={laporanList}
        jenisSampah={jenisSampah}
        wilayah={wilayah}
      />
    </div>
  );
}
