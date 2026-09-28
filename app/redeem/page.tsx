import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import RedeemButton from './RedeemButton';

export default async function RedeemPage() {
  const session = await getSession();
  
  if (!session) {
    return (
      <div className="p-8 text-center min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="bg-clay-card dark:bg-clay-card-dark p-10 rounded-[2rem] shadow-clay">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Anda harus login untuk menukar poin.</p>
        </div>
      </div>
    );
  }

  const [user, rewards, riwayat] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.reward.findMany({ orderBy: { poinDibutuhkan: 'asc' } }),
    prisma.rewardRedeem.findMany({
      where: { userId: session.userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) return null;

  // Helper untuk mapping StatusRedeem ke style Badge
  function getStatusVariant(status: string) {
    if (status === 'PENDING') return 'pending';
    if (status === 'DIPROSES' || status === 'DIKIRIM') return 'info';
    if (status === 'SELESAI') return 'success';
    return 'error'; // DIBATALKAN
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10 min-h-[calc(100vh-80px)]">
      
      {/* ── Header & Poin Banner ── */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight mb-2">
            Katalog Reward 🎁
          </h1>
          <p className="text-clay-muted dark:text-clay-muted-dark text-lg">
            Tukarkan poin yang telah Anda kumpulkan dengan berbagai hadiah menarik.
          </p>
        </div>

        <div className="shrink-0 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-clay-sm dark:shadow-clay-dark flex flex-col justify-center min-w-[280px] relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-9xl transform translate-x-1/4 -translate-y-1/4">✨</div>
          <p className="text-emerald-100 font-medium mb-1 relative z-10">Saldo Poin Anda</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-5xl font-extrabold drop-shadow-md">{user.poin.toLocaleString('id-ID')}</p>
            <p className="text-emerald-100 font-bold tracking-wide">Poin</p>
          </div>
        </div>
      </div>

      <div className="clay-divider" />

      {/* ── Grid Rewards ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🛍️ Tersedia untuk Anda
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const isAffordable = user.poin >= reward.poinDibutuhkan;
            const isOutOfStock = reward.stok <= 0;
            const disabled = !isAffordable || isOutOfStock;

            return (
              <div key={reward.id} className="flex flex-col bg-clay-surface dark:bg-clay-surface-dark rounded-[2rem] shadow-clay-xs dark:shadow-clay-dark-xs overflow-hidden transition-all duration-300 hover:shadow-clay-sm dark:hover:shadow-clay-dark-sm hover:-translate-y-1 border border-transparent hover:border-emerald-500/20">
                {/* Image Area */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-800 w-full overflow-hidden shrink-0">
                  {reward.gambarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={reward.gambarUrl}
                      alt={reward.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
                  )}
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="neutral" className="bg-white/90 dark:bg-black/90 backdrop-blur border-none shadow-sm text-gray-800 dark:text-gray-200">
                      {reward.kategoriReward}
                    </Badge>
                  </div>
                  {/* Stock Tag */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur ${
                      isOutOfStock 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      {isOutOfStock ? 'Habis' : `Sisa ${reward.stok}`}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 leading-tight mb-2">
                      {reward.nama}
                    </h3>
                    <p className="text-sm text-clay-muted dark:text-clay-muted-dark line-clamp-2">
                      {reward.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Harga:</span>
                      <span className={`text-xl font-extrabold ${isAffordable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {reward.poinDibutuhkan.toLocaleString('id-ID')} <span className="text-sm font-bold">Pts</span>
                      </span>
                    </div>

                    <RedeemButton rewardId={reward.id} disabled={disabled} />
                    
                    {!isAffordable && !isOutOfStock && (
                      <p className="text-center text-xs text-red-500 mt-2 font-medium">
                        Kurang { (reward.poinDibutuhkan - user.poin).toLocaleString('id-ID') } poin
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Riwayat Redeem ── */}
      {riwayat.length > 0 && (
        <div className="mt-16 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🕒 Riwayat Penukaran
          </h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
              {riwayat.map((r) => (
                <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{r.reward.nama}</h4>
                    <p className="text-sm text-clay-muted dark:text-clay-muted-dark mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-500">- {r.poinDigunakan} pts</span>
                    <Badge dot variant={getStatusVariant(r.status)}>
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
