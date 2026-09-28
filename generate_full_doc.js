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
<head>
<meta charset='utf-8'>
<title>Dokumentasi Lengkap Proyek</title>
<style>
  body { font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 12pt; padding: 20px; }
  h1 { text-align: center; font-size: 18pt; margin-bottom: 24px; text-transform: uppercase; font-weight: bold; }
  h2 { font-size: 14pt; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 5px; page-break-before: always; }
  h3 { font-size: 12pt; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
  p { text-align: justify; margin-bottom: 10px; }
  ul, ol { margin-bottom: 15px; text-align: justify; }
  .cover { text-align: center; margin-top: 150px; margin-bottom: 200px; page-break-after: always; }
  .img-container { text-align: center; margin: 20px 0; }
  img { max-width: 100%; height: auto; border: 1px solid #ddd; }
  .placeholder { color: red; font-style: italic; text-align: center; display: block; margin: 10px 0; border: 1px dashed red; padding: 20px; }
</style>
</head>
<body>
  
  <!-- COVER -->
  <div class='cover'>
    <h1 style='font-size: 22pt;'>DOKUMENTASI LENGKAP PROYEK<br>SISTEM PENGELOLAAN SAMPAH (RUBBISH)</h1>
    <br><br><br><br>
    <p style='text-align: center; font-size: 14pt;'><b>Mata Pelajaran / Tugas:</b><br>Basis Data & Pemrograman Web</p>
    <br><br>
    <p style='text-align: center; font-size: 14pt;'><b>Disusun Oleh:</b><br>
    Nama: [Isi Nama Lengkap Anda]<br>
    No. Absen: [Isi Nomor Absen Anda]<br>
    Kelas: [Isi Kelas Anda]</p>
  </div>

  <!-- BAB 1 -->
  <h2>BAB I: PENDAHULUAN</h2>
  <h3>1.1 Latar Belakang</h3>
  <p>Pengelolaan sampah daur ulang masih sering dilakukan secara manual dan tidak terdokumentasi dengan baik. Oleh karena itu, dibangunlah aplikasi &quot;Rubbish&quot;, sebuah Sistem Pengelolaan Sampah Berbasis Web. Aplikasi ini mempermudah masyarakat (User) untuk menyetorkan sampah daur ulang mereka dan mendapatkan apresiasi berupa poin yang dapat ditukarkan (redeem) dengan berbagai hadiah menarik. Di sisi lain, pengepul atau petugas (Admin) dapat memanajemen data masuk dan memverifikasi setoran sampah secara sistematis.</p>
  
  <h3>1.2 Tujuan Proyek</h3>
  <ul>
    <li>Mendigitalkan proses penyetoran dan verifikasi sampah daur ulang.</li>
    <li>Menerapkan arsitektur web modern yang responsif dan mudah digunakan (User Friendly).</li>
    <li>Mengimplementasikan Relational Database Management System (RDBMS) dengan constraint ketat untuk menjaga integritas data transaksi.</li>
  </ul>

  <!-- BAB 2 -->
  <h2>BAB II: TEKNOLOGI &amp; ARSITEKTUR SISTEM</h2>
  <h3>2.1 Stack Teknologi</h3>
  <p>Proyek ini dibangun menggunakan kumpulan teknologi modern (Full-Stack), yaitu:</p>
  <ul>
    <li><b>Framework Frontend &amp; Backend:</b> Next.js 16 (React) dengan App Router dan Server Actions.</li>
    <li><b>Bahasa Pemrograman:</b> TypeScript untuk keamanan penulisan kode (Type Safety).</li>
    <li><b>Desain Antarmuka:</b> Tailwind CSS dengan konsep desain <i>Claymorphism</i> yang modern.</li>
    <li><b>Database:</b> PostgreSQL (diakses melalui antarmuka pgAdmin).</li>
    <li><b>ORM (Object-Relational Mapping):</b> Prisma ORM untuk mengelola skema database dan migrasi.</li>
  </ul>

  <h3>2.2 Struktur Database &amp; Constraint (RDBMS)</h3>
  <p>Basis data dirancang dengan prinsip relasional yang kuat untuk menghindari anomali data:</p>
  <ul>
    <li><b>Foreign Key Constraints:</b> Digunakan aturan <code>ON DELETE CASCADE</code> (contoh: jika akun User dihapus, semua riwayat laporannya otomatis terhapus) dan <code>ON DELETE RESTRICT</code> (contoh: jenis sampah tidak bisa dihapus jika sudah ada riwayat transaksi).</li>
    <li><b>CHECK Constraints:</b> Diterapkan pada PostgreSQL untuk memastikan <code>poin &gt;= 0</code>, <code>berat &gt; 0</code>, dan <code>stok &gt;= 0</code>.</li>
    <li><b>Database Transaction (Atomicity):</b> Pada proses transaksi setor sampah dan redeem reward, digunakan perintah <code>BEGIN...COMMIT</code> melalui <code>prisma.$transaction</code>. Ini memastikan jika poin bertambah, status laporan pasti berubah; jika salah satu gagal, seluruh proses dibatalkan (Rollback).</li>
  </ul>

  <!-- BAB 3 -->
  <h2>BAB III: DESAIN SISTEM (UML &amp; ERD)</h2>
  
  <h3>3.1 Entity Relationship Diagram (ERD)</h3>
  <p>ERD menggambarkan entitas yang terlibat beserta relasinya di dalam database.</p>
  <div class='img-container'><img src='data:image/png;base64,${erd}' alt='ERD' /></div>

  <h3>3.2 Use Case Diagram</h3>
  <p>Use Case diagram menjelaskan interaksi antara Aktor (User dan Admin) dengan fungsionalitas sistem.</p>
  <div class='img-container'><img src='data:image/png;base64,${usecase}' alt='Use Case' /></div>

  <h3>3.3 Activity Diagram: Transaksi Setor Sampah</h3>
  <p>Alur kerja ketika user melaporkan sampah hingga divalidasi oleh admin dan poin dikreditkan.</p>
  <div class='img-container'><img src='data:image/png;base64,${activity_setor}' alt='Activity Setor' /></div>

  <h3>3.4 Activity Diagram: Transaksi Tukar Poin (Redeem)</h3>
  <p>Alur kerja penukaran poin user dengan hadiah fisik atau digital.</p>
  <div class='img-container'><img src='data:image/png;base64,${activity_redeem}' alt='Activity Redeem' /></div>

  <!-- BAB 4 -->
  <h2>BAB IV: IMPLEMENTASI ANTARMUKA (SCREENSHOT)</h2>
  <p>Berikut adalah hasil implementasi sistem ke dalam antarmuka berbasis web. <i>(Catatan: Aplikasi memiliki batasan otorisasi antara halaman User dan Admin).</i></p>

  <h3>4.1 Halaman Login &amp; Register</h3>
  <span class='placeholder'>[HAPUS TULISAN INI: SILAKAN PASTE GAMBAR SCREENSHOT HALAMAN LOGIN DI SINI]</span>

  <h3>4.2 Dashboard User &amp; Form Lapor Sampah</h3>
  <p>User dapat melihat saldo poin dan menekan tombol untuk melaporkan sampah. Sistem akan menghitung estimasi poin secara <i>real-time</i>.</p>
  <span class='placeholder'>[HAPUS TULISAN INI: SILAKAN PASTE GAMBAR SCREENSHOT DASHBOARD USER / FORM LAPORAN DI SINI]</span>

  <h3>4.3 Dashboard Admin &amp; Verifikasi Setor (Transaksi)</h3>
  <p>Admin mengelola laporan masuk. Pada saat mengklik Konfirmasi Setor, formulir akan otomatis mengisi berat dan jenis sampah, lalu mengkalkulasi poin akhir sebelum dieksekusi.</p>
  <span class='placeholder'>[HAPUS TULISAN INI: SILAKAN PASTE GAMBAR SCREENSHOT DASHBOARD ADMIN / FORM SETOR ADMIN DI SINI]</span>

  <h3>4.4 Halaman Tukar Poin (Redeem) &amp; Riwayat Klaim</h3>
  <p>User dapat menukarkan poin dengan hadiah. Admin juga dapat melihat dan mengirimkan hadiah tersebut dari Dashboard Admin.</p>
  <span class='placeholder'>[HAPUS TULISAN INI: SILAKAN PASTE GAMBAR SCREENSHOT HALAMAN REDEEM REWARD DI SINI]</span>

  <!-- BAB 5 -->
  <h2>BAB V: KESIMPULAN</h2>
  <p>Proyek Sistem Pengelolaan Sampah (Rubbish) ini berhasil dikembangkan secara utuh (Full-Stack). Integrasi antara antarmuka web modern dengan basis data PostgreSQL berjalan sangat baik. Penggunaan skema relasional, Constraint, dan Database Transactions memastikan sistem bekerja dengan aman, akurat, dan dapat menangani skenario transaksi (setor sampah &amp; klaim hadiah) tanpa adanya inkonsistensi data.</p>
  
</body>
</html>`;

fs.writeFileSync('Dokumentasi_Lengkap_Sistem_Pengelolaan_Sampah.doc', html);
console.log('Dokumentasi Lengkap Doc file fully written!');
