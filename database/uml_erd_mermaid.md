# Dokumentasi UML & ERD — Sistem Pengelolaan Sampah "Rubbish"

> Salin notasi Mermaid di bawah ke [Mermaid Live Editor](https://mermaid.live), [draw.io](https://draw.io), atau langsung paste ke dokumen Word/PDF.

---

## 1. Use Case Diagram

```mermaid
graph TD
    subgraph Actors["👥 Aktor"]
        U["🧑 Masyarakat (User)"]
        A["🛡️ Administrator (Admin)"]
    end

    subgraph UCUser["Use Case — Masyarakat"]
        UC1["Daftar Akun"]
        UC2["Login"]
        UC3["Buat Laporan Sampah"]
        UC4["Unggah Foto / Tempel URL"]
        UC5["Lihat Riwayat Laporan"]
        UC6["Lihat Saldo Poin"]
        UC7["Redeem Reward"]
        UC8["Lihat Riwayat Redeem"]
    end

    subgraph UCAdmin["Use Case — Administrator"]
        UC9["Login"]
        UC10["Lihat Semua Laporan"]
        UC11["Ubah Status Laporan"]
        UC12["Input Setor Sampah\n(berat aktual + jenis)"]
        UC13["Berikan Poin ke User"]
        UC14["Kelola Katalog Reward"]
    end

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8

    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12
    A --> UC13
    A --> UC14

    UC3 -.->|include| UC4
    UC12 -.->|include| UC13
```

---

## 2. Activity Diagram — Transaksi Setor Sampah

```mermaid
flowchart TD
    Start([Mulai]) --> U1[User Buat Laporan Sampah]
    U1 --> U2[Isi: jenis, berat estimasi,\nalamat, deskripsi, foto]
    U2 --> U3[Simpan Laporan\nStatus: PENDING]
    U3 --> A1{Admin Menerima\nLaporan?}

    A1 -->|Terima| A2[Ubah Status: DITERIMA]
    A1 -->|Tolak| A3[Ubah Status: DITOLAK]
    A3 --> N2[Kirim Notifikasi Ditolak ke User]
    N2 --> End1([Selesai])

    A2 --> A4[Admin Timbang Sampah Fisik]
    A4 --> A5[Buka Form Setor Sampah]
    A5 --> A6[Input Berat Aktual kg]
    A6 --> A7[Pilih Jenis Sampah]
    A7 --> DB1[(BEGIN TRANSACTION)]

    DB1 --> DB2[Hitung totalPoin =\nberat_kg × harga_per_kg ÷ 1000]
    DB2 --> DB3[INSERT transaksi_setor]
    DB3 --> DB4[UPDATE laporan_sampah\nstatus = SELESAI,\npoin_didapat = totalPoin]
    DB4 --> DB5[UPDATE users\npoin += totalPoin]
    DB5 --> DB6[INSERT notifikasi\ntype = SUCCESS]
    DB6 --> DB7[(COMMIT)]

    DB7 --> N1[User Terima Notifikasi Poin]
    N1 --> End2([Selesai])
```

---

## 3. Activity Diagram — Transaksi Redeem Poin

```mermaid
flowchart TD
    Start([Mulai]) --> R1[User Buka Halaman Redeem]
    R1 --> R2[Lihat Katalog Reward & Saldo Poin]
    R2 --> R3[Pilih Reward]
    R3 --> C1{Cek Syarat}

    C1 -->|Poin Cukup &\nStok > 0| DB1[(BEGIN TRANSACTION)]
    C1 -->|Poin Tidak Cukup| E1[Tampilkan Error:\nPoin Tidak Mencukupi]
    C1 -->|Stok Habis| E2[Tampilkan Error:\nStok Habis]
    E1 --> End1([Batal])
    E2 --> End1

    DB1 --> DB2[UPDATE users\npoin -= poin_dibutuhkan]
    DB2 --> DB3[UPDATE reward\nstok -= 1]
    DB3 --> DB4[INSERT reward_redeem\nstatus = PENDING]
    DB4 --> DB5[INSERT notifikasi\ntype = SUCCESS]
    DB5 --> DB6[(COMMIT)]

    DB6 --> R4[Tampilkan Konfirmasi Berhasil]
    R4 --> End2([Selesai])
```

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users {
        UUID    id              PK
        VARCHAR nomor_identitas UK
        VARCHAR nama
        VARCHAR email           UK
        VARCHAR no_hp           UK
        TEXT    password
        ENUM    tipe_pendaftaran
        ENUM    role
        INTEGER poin
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    jenis_sampah {
        UUID    id          PK
        VARCHAR nama_jenis  UK
        TEXT    deskripsi
        NUMERIC harga_per_kg
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    wilayah {
        UUID    id           PK
        VARCHAR nama_wilayah UK
        VARCHAR kode_wilayah UK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    laporan_sampah {
        UUID    id              PK
        UUID    user_id         FK
        UUID    jenis_sampah_id FK
        UUID    wilayah_id      FK
        NUMERIC berat
        TEXT    alamat_jemput
        TEXT    foto_url
        TIMESTAMPTZ tanggal_lapor
        TEXT    deskripsi
        ENUM    status
        ENUM    prioritas
        INTEGER poin_didapat
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    foto_sampah {
        UUID    id         PK
        UUID    laporan_id FK-UK
        TEXT    image_url
        TIMESTAMPTZ created_at
    }

    transaksi_setor {
        UUID    id              PK
        UUID    laporan_id      FK-UK
        UUID    admin_id        FK
        UUID    jenis_sampah_id FK
        NUMERIC berat_kg
        INTEGER total_poin
        TIMESTAMPTZ created_at
    }

    reward {
        UUID    id              PK
        VARCHAR nama
        TEXT    deskripsi
        INTEGER poin_dibutuhkan
        INTEGER stok
        TEXT    gambar_url
        ENUM    kategori_reward
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    reward_redeem {
        UUID    id             PK
        UUID    user_id        FK
        UUID    reward_id      FK
        INTEGER poin_digunakan
        ENUM    status
        TIMESTAMPTZ created_at
    }

    notifikasi {
        UUID    id      PK
        UUID    user_id FK
        VARCHAR judul
        TEXT    pesan
        ENUM    type
        BOOLEAN is_read
        TIMESTAMPTZ created_at
    }

    users           ||--o{ laporan_sampah   : "membuat"
    users           ||--o{ reward_redeem    : "menukarkan"
    users           ||--o{ notifikasi       : "menerima"
    users           ||--o{ transaksi_setor  : "memproses (admin)"

    jenis_sampah    ||--o{ laporan_sampah   : "dikategorikan dalam"
    jenis_sampah    ||--o{ transaksi_setor  : "digunakan dalam"

    wilayah         ||--o{ laporan_sampah   : "berlokasi di"

    laporan_sampah  ||--o| foto_sampah      : "memiliki foto"
    laporan_sampah  ||--o| transaksi_setor  : "diproses menjadi"

    reward          ||--o{ reward_redeem    : "ditukarkan dalam"
```

---

## 5. Ringkasan Tabel & Constraints

| Tabel | Primary Key | Unique Keys | CHECK Constraints | ON DELETE |
|---|---|---|---|---|
| `users` | `id` (UUID) | `email`, `nomor_identitas`, `no_hp` | `poin >= 0`, format email, no_hp ≥10 digit | — |
| `jenis_sampah` | `id` (UUID) | `nama_jenis` | `harga_per_kg > 0` | — |
| `wilayah` | `id` (UUID) | `nama_wilayah`, `kode_wilayah` | — | — |
| `laporan_sampah` | `id` (UUID) | — | `berat > 0`, `poin_didapat >= 0` | user→CASCADE, jenis/wilayah→RESTRICT |
| `foto_sampah` | `id` (UUID) | `laporan_id` (1-to-1) | — | laporan→CASCADE |
| `transaksi_setor` | `id` (UUID) | `laporan_id` (1-to-1) | `berat_kg > 0`, `total_poin >= 0` | laporan→CASCADE, admin/jenis→RESTRICT |
| `reward` | `id` (UUID) | — | `poin_dibutuhkan > 0`, `stok >= 0` | — |
| `reward_redeem` | `id` (UUID) | — | `poin_digunakan > 0` | user→CASCADE, reward→RESTRICT |
| `notifikasi` | `id` (UUID) | — | — | user→CASCADE |

---

## 6. Alur Sistem Keseluruhan

```mermaid
graph LR
    subgraph Frontend
        P1[Halaman Login/Register]
        P2[Dashboard User]
        P3[Modal Form Laporan]
        P4[Dashboard Admin]
        P5[Modal Setor Sampah]
        P6[Halaman Redeem]
    end

    subgraph Backend["Next.js Server Actions"]
        S1["register() / login()"]
        S2["createLaporan()"]
        S3["adminVerifyLaporan()"]
        S4["adminSetorSampah()"]
        S5["redeemReward()"]
        S6["/api/upload — File Upload"]
    end

    subgraph Database["PostgreSQL (pgAdmin)"]
        D1[(users)]
        D2[(laporan_sampah)]
        D3[(transaksi_setor)]
        D4[(reward)]
        D5[(reward_redeem)]
        D6[(notifikasi)]
    end

    P1 --> S1 --> D1
    P3 --> S2 --> D2
    P4 --> S3 --> D2
    P5 --> S4 --> D3
    P5 --> S4 --> D1
    P6 --> S5 --> D4
    P6 --> S5 --> D5
    P3 --> S6 --> D2
```
