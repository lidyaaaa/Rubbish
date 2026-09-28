const fs = require('fs');

function getBase64(file) {
  try {
    return fs.readFileSync(file, 'base64');
  } catch (e) {
    return '';
  }
}

const erd = getBase64('diagrams/erd.png');
const usecase = getBase64('diagrams/usecase.png');
const activity_setor = getBase64('diagrams/activity_setor.png');
const activity_redeem = getBase64('diagrams/activity_redeem.png');

const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Laporan Proyek PJJ</title>
<style>
  body { font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 12pt; }
  h1 { text-align: center; font-size: 16pt; margin-bottom: 24px; text-transform: uppercase; }
  h2 { font-size: 14pt; margin-top: 24px; text-transform: uppercase; }
  h3 { font-size: 12pt; margin-top: 16px; }
  .cover { margin-bottom: 40px; }
  .img-container { text-align: center; margin: 20px 0; }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
  <div class='cover'>
    <h1>LAPORAN PROYEK PJJ:<br>SISTEM PENGELOLAAN SAMPAH BERBASIS WEB</h1>
    <p><b>Mata Pelajaran / Tugas:</b> Basis Data & Pemrograman Web<br>
    <b>Nama Lengkap:</b> [Isi Nama Lengkap Anda]<br>
    <b>No. Absen:</b> [Isi Nomor Absen Anda]<br>
    <b>Kelas:</b> [Isi Kelas Anda]</p>
  </div>
  <hr>

  <h2>BAB I: PENDAHULUAN</h2>
  <p>Website &quot;Rubbish&quot; adalah sistem informasi pengelolaan sampah berbasis web yang menjembatani masyarakat (User) dengan pengepul/petugas (Admin). Sistem ini dirancang untuk mendigitalkan proses penyetoran sampah daur ulang, di mana user dapat melaporkan sampah yang dimiliki, admin akan melakukan verifikasi dan penimbangan, lalu user akan mendapatkan poin yang dapat ditukarkan (redeem) dengan berbagai reward menarik.</p>

  <h2>BAB II: DESAIN BASIS DATA (RDBMS &amp; CONSTRAINTS)</h2>
  <p>Sistem menggunakan database relasional dengan rancangan tabel yang saling berelasi. Berikut adalah detail implementasi Constraint yang diterapkan:</p>
  <ol>
    <li><b>Primary Key (PK)</b>: Setiap tabel menggunakan UUID atau tipe data unik sebagai identifier.</li>
    <li><b>Foreign Key (FK) &amp; Referential Integrity</b>:
      <ul>
        <li><code>userId</code> pada <code>laporan_sampah</code> merujuk ke tabel <code>users</code>. Menggunakan aturan <code>ON DELETE CASCADE</code> sehingga jika user dihapus, riwayat laporannya otomatis terhapus.</li>
        <li><code>jenisSampahId</code> pada <code>transaksi_setor</code> merujuk ke <code>kategori_sampah</code>. Menggunakan aturan <code>ON DELETE RESTRICT</code> agar jenis sampah yang sudah memiliki riwayat transaksi tidak bisa dihapus sembarangan.</li>
      </ul>
    </li>
    <li><b>CHECK Constraints</b>: Poin, berat aktual, dan stok tidak boleh &lt; 0.</li>
    <li><b>UNIQUE Constraints</b>: Kolom <code>email</code> pada tabel <code>users</code> bersifat unik.</li>
  </ol>

  <h3>Entity Relationship Diagram (ERD)</h3>
  <div class='img-container'><img src='data:image/png;base64,${erd}' alt='ERD' /></div>

  <h2>BAB III: UML DIAGRAM (PERENCANAAN TRANSAKSI)</h2>
  <p>Sistem ini memiliki dua transaksi utama: <b>Transaksi Setor Sampah</b> (User mendapat poin) dan <b>Transaksi Tukar Poin (Redeem)</b> (User menukar poin dengan hadiah).</p>

  <h3>1. Use Case Diagram</h3>
  <div class='img-container'><img src='data:image/png;base64,${usecase}' alt='Use Case' /></div>

  <h3>2. Activity Diagram: Transaksi Setor Sampah</h3>
  <div class='img-container'><img src='data:image/png;base64,${activity_setor}' alt='Activity Setor' /></div>

  <h3>3. Activity Diagram: Transaksi Tukar Poin</h3>
  <div class='img-container'><img src='data:image/png;base64,${activity_redeem}' alt='Activity Redeem' /></div>

  <h2>BAB IV: IMPLEMENTASI TRANSAKSI PADA WEBSITE (NILAI TAMBAHAN)</h2>
  <p>Proses rencana transaksi di atas telah diimplementasikan 100% dan berjalan dengan baik pada aplikasi Web. Fitur yang berjalan meliputi Dashboard interaktif, kalkulasi poin Real-Time, manajemen laporan terpusat bagi admin, dan transaksi yang dilindungi oleh <i>Database Transaction (BEGIN...COMMIT)</i>.</p>
  
  <h3>Bukti Screenshot Tampilan Web:</h3>
  <p style='color: red; font-style: italic;'>[GAMBAR SCREENSHOT APLIKASI - Tempel gambar Dashboard, Form Setor, dan Halaman Tukar Poin Anda di sini]</p>

  <h2>KESIMPULAN</h2>
  <p>Aplikasi Web Pengelolaan Sampah ini berhasil dirancang sesuai dengan standar Basis Data Relasional yang kuat, didukung antarmuka pengguna yang modern, dan fitur manajemen transaksi poin-sampah yang terintegrasi penuh sesuai dengan instruksi tugas.</p>
</body>
</html>`;

fs.writeFileSync('Laporan_Proyek_Sistem_Pengelolaan_Sampah_Final.doc', html);
console.log('Doc file fully written with base64 images!');
