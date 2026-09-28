-- ============================================================
-- RUBBISH - Sistem Pengelolaan Sampah
-- DDL PostgreSQL siap dijalankan di pgAdmin 4 Query Tool
-- Versi: 2.0 | Dibuat: 2026
-- ============================================================
-- CARA PAKAI:
--   1. Buka pgAdmin 4 -> Connect ke server PostgreSQL
--   2. Buat database baru bernama "rubbish" (klik kanan Databases -> Create)
--   3. Klik kanan database "rubbish" -> Query Tool
--   4. Paste seluruh skrip ini -> klik tombol Run (F5)
-- ============================================================

-- Aktifkan ekstensi UUID (opsional, untuk pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- BERSIHKAN TABEL LAMA (AMAN untuk re-run)
-- ============================================================
DROP TABLE IF EXISTS notifikasi        CASCADE;
DROP TABLE IF EXISTS reward_redeem     CASCADE;
DROP TABLE IF EXISTS transaksi_setor   CASCADE;
DROP TABLE IF EXISTS foto_sampah       CASCADE;
DROP TABLE IF EXISTS laporan_sampah    CASCADE;
DROP TABLE IF EXISTS wilayah           CASCADE;
DROP TABLE IF EXISTS jenis_sampah      CASCADE;
DROP TABLE IF EXISTS reward            CASCADE;
DROP TABLE IF EXISTS users             CASCADE;

-- Hapus tipe ENUM yang mungkin sudah ada
DROP TYPE IF EXISTS "Role"             CASCADE;
DROP TYPE IF EXISTS "TipePendaftaran"  CASCADE;
DROP TYPE IF EXISTS "StatusLaporan"    CASCADE;
DROP TYPE IF EXISTS "Prioritas"        CASCADE;
DROP TYPE IF EXISTS "StatusRedeem"     CASCADE;
DROP TYPE IF EXISTS "KategoriReward"   CASCADE;
DROP TYPE IF EXISTS "TipeNotifikasi"   CASCADE;

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE "Role" AS ENUM (
  'USER',
  'ADMIN',
  'SUPER_ADMIN'
);

CREATE TYPE "TipePendaftaran" AS ENUM (
  'RUMAH',
  'SEKOLAH',
  'PERUSAHAAN',
  'APARTEMEN'
);

CREATE TYPE "StatusLaporan" AS ENUM (
  'PENDING',
  'DITERIMA',
  'DIPROSES',
  'SELESAI',
  'DITOLAK'
);

CREATE TYPE "Prioritas" AS ENUM (
  'RENDAH',
  'SEDANG',
  'TINGGI',
  'DARURAT'
);

CREATE TYPE "StatusRedeem" AS ENUM (
  'PENDING',
  'DIPROSES',
  'DIKIRIM',
  'SELESAI',
  'DIBATALKAN'
);

CREATE TYPE "KategoriReward" AS ENUM (
  'VOUCHER',
  'PRODUK',
  'DONASI',
  'LAINNYA'
);

CREATE TYPE "TipeNotifikasi" AS ENUM (
  'INFO',
  'SUCCESS',
  'WARNING',
  'ERROR'
);

-- ============================================================
-- TABEL: users
-- Menyimpan data pengguna (masyarakat & admin)
-- ============================================================
CREATE TABLE users (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_identitas  VARCHAR(50)  NOT NULL UNIQUE,
  nama             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  no_hp            VARCHAR(20)  NOT NULL UNIQUE,
  password         TEXT         NOT NULL,
  tipe_pendaftaran "TipePendaftaran" NOT NULL DEFAULT 'RUMAH',
  role             "Role"       NOT NULL DEFAULT 'USER',
  poin             INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  -- CHECK Constraints
  CONSTRAINT users_poin_non_negative   CHECK (poin >= 0),
  CONSTRAINT users_email_format        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_no_hp_min_length    CHECK (LENGTH(no_hp) >= 10)
);

COMMENT ON TABLE  users IS 'Data pengguna sistem: masyarakat (USER) dan administrator (ADMIN)';
COMMENT ON COLUMN users.poin IS 'Saldo poin reward yang dimiliki pengguna. Tidak boleh negatif.';
COMMENT ON COLUMN users.nomor_identitas IS 'NIK/NPSN/NIB tergantung tipe_pendaftaran';

-- ============================================================
-- TABEL: jenis_sampah
-- Katalog kategori sampah dengan nilai poin per kg
-- ============================================================
CREATE TABLE jenis_sampah (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_jenis   VARCHAR(100)  NOT NULL UNIQUE,
  deskripsi    TEXT,
  harga_per_kg NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- CHECK Constraints
  CONSTRAINT jenis_sampah_harga_positive CHECK (harga_per_kg > 0)
);

COMMENT ON TABLE  jenis_sampah IS 'Katalog jenis/kategori sampah. harga_per_kg digunakan untuk menghitung poin.';
COMMENT ON COLUMN jenis_sampah.harga_per_kg IS 'Nilai poin per kilogram sampah jenis ini. Harus lebih dari 0.';

-- ============================================================
-- TABEL: wilayah
-- Area/zona penjemputan sampah
-- ============================================================
CREATE TABLE wilayah (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_wilayah  VARCHAR(150) NOT NULL UNIQUE,
  kode_wilayah  VARCHAR(20)  UNIQUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE wilayah IS 'Daftar wilayah/zona operasional penjemputan sampah';

-- ============================================================
-- TABEL: laporan_sampah
-- Laporan pengumpulan sampah yang dibuat oleh user
-- ============================================================
CREATE TABLE laporan_sampah (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID             NOT NULL,
  jenis_sampah_id UUID             NOT NULL,
  wilayah_id      UUID             NOT NULL,
  berat           NUMERIC(8,2)     NOT NULL,
  alamat_jemput   TEXT,
  foto_url        TEXT,
  tanggal_lapor   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  deskripsi       TEXT,
  status          "StatusLaporan"  NOT NULL DEFAULT 'PENDING',
  prioritas       "Prioritas"      NOT NULL DEFAULT 'SEDANG',
  poin_didapat    INTEGER          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),

  -- Foreign Keys
  CONSTRAINT fk_laporan_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE   -- Hapus user → hapus semua laporannya
    ON UPDATE CASCADE,

  CONSTRAINT fk_laporan_jenis_sampah
    FOREIGN KEY (jenis_sampah_id) REFERENCES jenis_sampah(id)
    ON DELETE RESTRICT  -- Jenis sampah tidak bisa dihapus jika masih ada laporan
    ON UPDATE CASCADE,

  CONSTRAINT fk_laporan_wilayah
    FOREIGN KEY (wilayah_id) REFERENCES wilayah(id)
    ON DELETE RESTRICT  -- Wilayah tidak bisa dihapus jika masih ada laporan
    ON UPDATE CASCADE,

  -- CHECK Constraints
  CONSTRAINT laporan_berat_positive      CHECK (berat > 0),
  CONSTRAINT laporan_poin_non_negative   CHECK (poin_didapat >= 0)
);

COMMENT ON TABLE  laporan_sampah IS 'Laporan sampah yang diajukan oleh pengguna untuk dijemput';
COMMENT ON COLUMN laporan_sampah.berat IS 'Estimasi berat sampah dalam kilogram (diisi user). Harus > 0.';
COMMENT ON COLUMN laporan_sampah.foto_url IS 'URL foto bukti sampah: path lokal (/uploads/...) atau URL eksternal';
COMMENT ON COLUMN laporan_sampah.alamat_jemput IS 'Alamat lengkap lokasi penjemputan sampah (free-text)';
COMMENT ON COLUMN laporan_sampah.poin_didapat IS 'Poin yang diberikan setelah laporan SELESAI diverifikasi admin';

-- ============================================================
-- TABEL: foto_sampah
-- Tabel legacy untuk foto (relasi one-to-one dengan laporan)
-- Dipertahankan untuk kompatibilitas backward
-- ============================================================
CREATE TABLE foto_sampah (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id  UUID        NOT NULL UNIQUE, -- UNIQUE = one-to-one
  image_url   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_foto_laporan
    FOREIGN KEY (laporan_id) REFERENCES laporan_sampah(id)
    ON DELETE CASCADE   -- Hapus laporan → hapus fotonya
    ON UPDATE CASCADE
);

COMMENT ON TABLE foto_sampah IS 'Foto bukti sampah (relasi one-to-one dengan laporan_sampah). Dipertahankan untuk kompatibilitas.';

-- ============================================================
-- TABEL: transaksi_setor
-- Transaksi penimbangan riil oleh admin setelah sampah diterima
-- ============================================================
CREATE TABLE transaksi_setor (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id      UUID         NOT NULL UNIQUE, -- One-to-one: satu laporan satu transaksi setor
  admin_id        UUID         NOT NULL,
  jenis_sampah_id UUID         NOT NULL,
  berat_kg        NUMERIC(8,2) NOT NULL,
  total_poin      INTEGER      NOT NULL,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  -- Foreign Keys
  CONSTRAINT fk_setor_laporan
    FOREIGN KEY (laporan_id) REFERENCES laporan_sampah(id)
    ON DELETE CASCADE   -- Hapus laporan → hapus transaksi setornya
    ON UPDATE CASCADE,

  CONSTRAINT fk_setor_admin
    FOREIGN KEY (admin_id) REFERENCES users(id)
    ON DELETE RESTRICT  -- Admin tidak bisa dihapus jika pernah memproses setoran
    ON UPDATE CASCADE,

  CONSTRAINT fk_setor_jenis_sampah
    FOREIGN KEY (jenis_sampah_id) REFERENCES jenis_sampah(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  -- CHECK Constraints
  CONSTRAINT setor_berat_positive      CHECK (berat_kg > 0),
  CONSTRAINT setor_poin_non_negative   CHECK (total_poin >= 0)
);

COMMENT ON TABLE  transaksi_setor IS 'Catatan penimbangan sampah aktual oleh admin. Dibuat saat status laporan menjadi SELESAI.';
COMMENT ON COLUMN transaksi_setor.berat_kg IS 'Berat aktual sampah yang ditimbang admin (kg). Harus > 0.';
COMMENT ON COLUMN transaksi_setor.total_poin IS 'Poin yang diberikan = berat_kg * harga_per_kg / 1000. Tidak boleh negatif.';

-- ============================================================
-- TABEL: reward
-- Katalog hadiah yang bisa ditukar dengan poin
-- ============================================================
CREATE TABLE reward (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  nama            VARCHAR(255)     NOT NULL,
  deskripsi       TEXT,
  poin_dibutuhkan INTEGER          NOT NULL,
  stok            INTEGER          NOT NULL DEFAULT 0,
  gambar_url      TEXT,
  kategori_reward "KategoriReward" NOT NULL DEFAULT 'VOUCHER',
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),

  -- CHECK Constraints
  CONSTRAINT reward_poin_positive    CHECK (poin_dibutuhkan > 0),
  CONSTRAINT reward_stok_non_negative CHECK (stok >= 0)
);

COMMENT ON TABLE  reward IS 'Katalog reward yang dapat ditukarkan pengguna menggunakan poin';
COMMENT ON COLUMN reward.poin_dibutuhkan IS 'Jumlah poin yang diperlukan untuk menukarkan reward ini. Harus > 0.';
COMMENT ON COLUMN reward.stok IS 'Jumlah stok reward yang tersedia. Tidak boleh negatif.';

-- ============================================================
-- TABEL: reward_redeem
-- Riwayat penukaran reward oleh pengguna
-- ============================================================
CREATE TABLE reward_redeem (
  id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID           NOT NULL,
  reward_id      UUID           NOT NULL,
  poin_digunakan INTEGER        NOT NULL, -- = poin_keluar
  status         "StatusRedeem" NOT NULL DEFAULT 'PENDING',
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  -- Foreign Keys
  CONSTRAINT fk_redeem_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE   -- Hapus user → hapus riwayat redeemnya
    ON UPDATE CASCADE,

  CONSTRAINT fk_redeem_reward
    FOREIGN KEY (reward_id) REFERENCES reward(id)
    ON DELETE RESTRICT  -- Reward tidak bisa dihapus jika sudah pernah di-redeem
    ON UPDATE CASCADE,

  -- CHECK Constraints
  CONSTRAINT redeem_poin_positive CHECK (poin_digunakan > 0)
);

COMMENT ON TABLE  reward_redeem IS 'Riwayat transaksi penukaran poin dengan reward oleh pengguna';
COMMENT ON COLUMN reward_redeem.poin_digunakan IS 'Jumlah poin yang dikeluarkan untuk penukaran (poin_keluar)';

-- ============================================================
-- TABEL: notifikasi
-- Notifikasi in-app untuk pengguna
-- ============================================================
CREATE TABLE notifikasi (
  id         UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID             NOT NULL,
  judul      VARCHAR(255)     NOT NULL,
  pesan      TEXT             NOT NULL,
  type       "TipeNotifikasi" NOT NULL DEFAULT 'INFO',
  is_read    BOOLEAN          NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ      NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_notif_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

COMMENT ON TABLE notifikasi IS 'Notifikasi in-app: pemberitahuan status laporan, reward, dll.';

-- ============================================================
-- INDEXES (untuk performa query yang sering dipakai)
-- ============================================================

-- users
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_role         ON users(role);

-- laporan_sampah
CREATE INDEX idx_laporan_user_id    ON laporan_sampah(user_id);
CREATE INDEX idx_laporan_status     ON laporan_sampah(status);
CREATE INDEX idx_laporan_created_at ON laporan_sampah(created_at DESC);

-- transaksi_setor
CREATE INDEX idx_setor_admin_id     ON transaksi_setor(admin_id);
CREATE INDEX idx_setor_laporan_id   ON transaksi_setor(laporan_id);

-- reward_redeem
CREATE INDEX idx_redeem_user_id     ON reward_redeem(user_id);
CREATE INDEX idx_redeem_created_at  ON reward_redeem(created_at DESC);

-- notifikasi
CREATE INDEX idx_notif_user_id      ON notifikasi(user_id);
CREATE INDEX idx_notif_is_read      ON notifikasi(user_id, is_read);

-- ============================================================
-- FUNGSI: update_updated_at_column()
-- Trigger otomatis memperbarui kolom updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Daftarkan trigger pada tabel yang punya updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_jenis_sampah_updated_at
  BEFORE UPDATE ON jenis_sampah
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_wilayah_updated_at
  BEFORE UPDATE ON wilayah
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_laporan_updated_at
  BEFORE UPDATE ON laporan_sampah
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_reward_updated_at
  BEFORE UPDATE ON reward
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DATA AWAL (SEED) - Opsional, hapus jika tidak diperlukan
-- ============================================================

-- Jenis Sampah
INSERT INTO jenis_sampah (nama_jenis, deskripsi, harga_per_kg) VALUES
  ('Plastik',    'Botol plastik, kemasan plastik, kantong kresek',   2000.00),
  ('Kertas',     'Koran bekas, kardus, kertas HVS, buku',             1500.00),
  ('Logam',      'Kaleng aluminium, besi tua, tembaga',              3000.00),
  ('Kaca',       'Botol kaca, pecahan kaca daur ulang',              1000.00),
  ('Elektronik', 'Barang elektronik bekas (e-waste)',                5000.00),
  ('Organik',    'Sisa makanan, dedaunan, limbah dapur',              500.00);

-- Wilayah
INSERT INTO wilayah (nama_wilayah, kode_wilayah) VALUES
  ('Jakarta Pusat',   'JKT-PST'),
  ('Jakarta Utara',   'JKT-UTR'),
  ('Jakarta Selatan', 'JKT-SLT'),
  ('Jakarta Barat',   'JKT-BRT'),
  ('Jakarta Timur',   'JKT-TMR'),
  ('Depok',           'DPK'),
  ('Bekasi',          'BKS'),
  ('Tangerang',       'TNG');

-- Reward
INSERT INTO reward (nama, deskripsi, poin_dibutuhkan, stok, kategori_reward) VALUES
  ('Voucher Belanja Rp 25.000',  'Voucher belanja di minimarket terdekat',                      25,  20, 'VOUCHER'),
  ('Voucher Belanja Rp 50.000',  'Voucher belanja di supermarket partner',                      50,  10, 'VOUCHER'),
  ('Voucher Makan Rp 75.000',    'Voucher makan di restoran partner',                           75,   5, 'VOUCHER'),
  ('Tumbler Eco',                'Botol minum ramah lingkungan 500ml',                          30,  15, 'PRODUK'),
  ('Tas Daur Ulang',             'Tas belanja dari bahan daur ulang',                           20,  25, 'PRODUK'),
  ('Donasi 1 Pohon',             'Donasi penanaman 1 pohon di area hijau kota',                 10, 100, 'DONASI'),
  ('Donasi Paket Sembako',       'Donasi 1 paket sembako untuk keluarga kurang mampu',          50,  10, 'DONASI');

-- ============================================================
-- VERIFIKASI AKHIR: Cek semua tabel berhasil dibuat
-- ============================================================
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(quote_ident(tablename))) AS ukuran
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
