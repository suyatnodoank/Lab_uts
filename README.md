# Pustaka UT: Aplikasi Web Pemesanan Buku

Tugas UTS Pemrograman Web 1

| | |
|---|---|
| **Nama** | Suyatno |
| **NIM** | 312510129 |
| **Kelas** | I253C |
| **Link video penjelasan** | _isi link video (maks. 15 menit)_ |

---

## Daftar Isi
1. [Deskripsi Project](#1-deskripsi-project)
2. [Fitur](#2-fitur)
3. [Teknologi](#3-teknologi)
4. [Struktur Folder](#4-struktur-folder)
5. [Cara Menjalankan](#5-cara-menjalankan)
6. [Penjelasan dan Hasil Tangkapan Layar](#6-penjelasan-dan-hasil-tangkapan-layar)
7. [Konsep yang Digunakan](#7-konsep-yang-digunakan)
8. [Alur Berpikir dan Argumentasi Desain](#8-alur-berpikir-dan-argumentasi-desain)
9. [Kendala dan Solusi](#9-kendala-dan-solusi)

---

## 1. Deskripsi Project

**Pustaka UT** adalah aplikasi web sederhana untuk pemesanan buku ajar pada toko buku online. Project ini berfokus pada sisi **front-end**, jadi tidak memakai server atau database. Semua data (pengguna, katalog buku, dan data pengiriman) diambil dari variabel JavaScript berformat array/objek JSON pada file terpisah `js/data.js`.

Pengguna bisa masuk ke akun, melihat katalog dan stok buku, membuat pesanan, lalu melacak pengiriman dengan nomor Delivery Order (DO).

Tiga indikator yang dinilai pada tugas ini:
1. Merancang struktur HTML yang semantik dan valid.
2. Mengelola gaya antarmuka dengan CSS (inline, internal, external).
3. Memakai JavaScript untuk manipulasi DOM, validasi form, manipulasi data tabel, dan interaksi UI (pop-up, modal box, alert box).

## 2. Fitur

- **Login** dengan validasi, pop-up error, serta modal **Lupa Password** dan **Daftar**.
- **Dashboard** dengan greeting sesuai waktu lokal dan 4 menu (Katalog, Tracking, Laporan Pemesanan, History Transaksi).
- **Katalog/Stok** yang dirender dinamis dari `dataKatalogBuku`, bisa dicari, dan bisa **menambah baris stok baru** lewat DOM.
- **Checkout**: keranjang yang bisa ditambah, diubah jumlahnya, dan dihapus, plus form data pemesan dan pembayaran.
- **Tracking** pengiriman dengan input Nomor DO, progress bar, status bertahap, detail ekspedisi, dan riwayat perjalanan.
- **Laporan Pemesanan** (ringkasan dan rekap per judul) serta **History Transaksi** dalam bentuk modal.
- Tampilan responsif dan mendukung navigasi keyboard.

## 3. Teknologi

| Teknologi | Peran |
|---|---|
| HTML5 | Struktur halaman semantik (`header`, `nav`, `main`, `section`, `form`, `table`) |
| CSS3 | Tema, layout grid/flexbox, modal, progress bar, responsif |
| JavaScript (vanilla) | Manipulasi DOM, validasi form, logika keranjang, tracking |
| `localStorage` | Menyimpan sesi login, keranjang, pesanan, dan perubahan katalog di browser |

## 4. Struktur Folder

```
tugas-uts-web1/
├── index.html          (halaman login)
├── dashboard.html
├── stok.html
├── tracking.html
├── checkout.html
├── css/
│   └── style.css
├── js/
│   ├── script.js       (logika semua halaman)
│   └── data.js         (data dummy: pengguna, katalog, tracking)
├── assets/
│   └── logo.png        (opsional)
├── img/                (cover buku)
│   ├── pengantar_komunikasi.jpg
│   ├── manajemen_keuangan.jpg
│   ├── kepemimpinan.jpg
│   ├── mikrobiologi.jpg
│   └── paud_perkembangan.jpg     
└── README.md
```

## 5. Cara Menjalankan

1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (Chrome, Edge, atau Firefox). Tidak perlu instalasi apa pun.
3. Masuk dengan akun contoh:

| Email | Password | Role |
|---|---|---|
| rina@gmail.com | rina123 | User |
| agus@gmail.com | agus123 | User |
| siti@gmail.com | siti123 | Admin |

4. Nomor DO contoh untuk halaman Tracking: `20230012` dan `20230013`.

---

## 6. Penjelasan dan Hasil Tangkapan Layar

> Setiap bagian berisi penjelasan singkat dan screenshot dari proses yang dijalankan. Simpan gambar di folder `screenshots/` dengan nama yang sama seperti di bawah.

### 6.1 Struktur Folder Project

Struktur folder dibuat sesuai ketentuan soal: file HTML di root, `css/`, `js/`, `img/`, dan `assets/`.

![Struktur folder](screenshots/01-struktur-folder.png)

### 6.2 Halaman Login (`index.html`)

Halaman login memiliki input email dan password serta tombol **Login**. Data dicocokkan dengan array `dataPengguna` di `data.js` (ditambah akun yang didaftarkan lewat modal Daftar). Jika salah, muncul pop-up berisi pesan *"Email/password yang anda masukkan salah"*.

**a. Tampilan awal**

![Login](screenshots/02-login.png)

**b. Validasi field kosong / format email salah**

![Validasi login](screenshots/03-login-validasi.png)

**c. Login gagal (pop-up error)**

![Login gagal](screenshots/04-login-gagal.png)

**d. Modal Lupa Password**

Pengguna memasukkan email. Sistem memeriksa apakah email terdaftar, lalu menampilkan pop-up konfirmasi (simulasi pengiriman tautan reset).

![Modal lupa password](screenshots/05-modal-lupa-password.png)

**e. Modal Daftar**

Form pendaftaran divalidasi (nama minimal 3 karakter, email valid dan belum terdaftar, password minimal 6 karakter, konfirmasi password harus sama). Akun baru disimpan di `localStorage`.

![Modal daftar](screenshots/06-modal-daftar.png)

### 6.3 Dashboard (`dashboard.html`)

Dashboard menampilkan *greeting* berdasarkan jam lokal perangkat (pagi, siang, sore, atau malam) beserta tanggal dan jam yang berjalan. Ada empat menu utama: Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, dan History Transaksi.

![Dashboard](screenshots/07-dashboard.png)

**Laporan Pemesanan** menghitung ringkasan (jumlah pesanan, total buku, total pembayaran) dan rekap per judul dari data pesanan.

![Laporan pemesanan](screenshots/08-laporan-pemesanan.png)

**History Transaksi** menampilkan daftar semua pesanan beserta link ke halaman tracking.

![History transaksi](screenshots/09-history-transaksi.png)

### 6.4 Informasi Stok / Katalog (`stok.html`)

Tabel dibuat secara dinamis dari variabel `dataKatalogBuku` dengan `createElement` (tanpa menulis baris tabel manual di HTML). Stok di bawah 200 eksemplar ditandai merah, dan ada kolom pencarian.

**a. Tabel katalog dari data.js**

![Tabel stok](screenshots/10-stok-tabel.png)

**b. Validasi form tambah buku**

![Validasi tambah buku](screenshots/11-stok-validasi.png)

**c. Baris stok baru berhasil ditambahkan**

Fitur tambah baris memakai JavaScript DOM. Data tersimpan di `localStorage`, dan buku yang ditambahkan bisa dihapus lagi.

![Baris baru](screenshots/12-stok-tambah-baris.png)

### 6.5 Halaman Pemesanan (`checkout.html`)

Halaman ini menampilkan data pemesanan yang bisa ditambah, diubah jumlahnya, dan dihapus, serta isian informasi pemesan dan pembayaran.

**a. Keranjang berisi buku dari katalog**

![Keranjang](screenshots/13-checkout-keranjang.png)

**b. Validasi form pemesan dan pembayaran**

Nama, email, nomor HP (format Indonesia), alamat, ekspedisi, dan metode pembayaran divalidasi. Total bayar dihitung otomatis (subtotal ditambah ongkos kirim sesuai ekspedisi).

![Validasi checkout](screenshots/14-checkout-validasi.png)

**c. Pesanan berhasil dan nomor DO**

Pesanan disimpan, stok buku berkurang, dan pengguna menerima nomor DO untuk dilacak.

![Pesanan berhasil](screenshots/15-checkout-sukses.png)

### 6.6 Informasi Pengiriman (`tracking.html`)

Pengguna memasukkan Nomor Delivery Order lalu menekan **Cari**. Sistem mencari di `dataTracking` (dan pesanan baru dari checkout), lalu menampilkan nama pemesan, status pengiriman (progress bar dan tahapan), detail ekspedisi, tanggal kirim, jenis paket, total pembayaran, serta riwayat perjalanan.

**a. Hasil pencarian DO `20230012`**

![Tracking 20230012](screenshots/16-tracking-20230012.png)

**b. Hasil pencarian DO `20230013` (paket sudah diterima)**

![Tracking 20230013](screenshots/17-tracking-20230013.png)

**c. Nomor DO tidak ditemukan / input tidak valid**

![Tracking tidak ditemukan](screenshots/18-tracking-tidak-ditemukan.png)

**d. Melacak pesanan baru dari checkout**

![Tracking pesanan baru](screenshots/19-tracking-pesanan-baru.png)

### 6.7 Tampilan Responsif

Tampilan menyesuaikan layar kecil (HP) dengan layout satu kolom.

![Responsif](screenshots/20-responsif.png)

---

## 7. Konsep yang Digunakan

**HTML semantik dan valid**
- Elemen semantik: `header`, `nav`, `main`, `section`, `form`, `fieldset`, `table` dengan `thead`/`tbody`/`th scope`.
- Setiap input punya `label`. Modal memakai atribut ARIA (`role="dialog"`, `aria-modal`, `aria-label`).

**CSS (external)**
- Seluruh gaya ada di `css/style.css`, memakai CSS variables untuk warna dan font agar konsisten.
- Layout dengan CSS Grid dan Flexbox, media query untuk responsif, dan `prefers-reduced-motion` untuk aksesibilitas.

**JavaScript**
- **Manipulasi DOM:** helper `el()` membuat elemen dengan `createElement`, sehingga tabel dan daftar dibangun secara dinamis dan aman dari injeksi teks.
- **Validasi form:** `fieldError()` dan `clearErrors()` menampilkan pesan di bawah field, ditambah pop-up ringkasan.
- **Pop-up, modal box, alert box:** `openModal()`, `closeModal()`, dan `showAlert()` (alert versi modal), serta `toast()` untuk notifikasi singkat.
- **Manipulasi data tabel:** tambah baris stok, hapus baris, filter pencarian, dan hitung total keranjang.
- **Penyimpanan:** `localStorage` untuk menjaga data antar halaman tanpa server.

**Modularitas file**
- Data dipisah di `data.js`, gaya di `style.css`, logika di `script.js`. Satu `script.js` melayani semua halaman, dan fungsi dipilih lewat atribut `data-page` pada `<body>`.

## 8. Alur Berpikir dan Argumentasi Desain

1. **Mulai dari data.** Struktur `dataPengguna`, `dataKatalogBuku`, dan `dataTracking` dipelajari dulu, karena semua halaman bergantung pada bentuk data ini.
2. **Rancang alur pengguna.** Login, lalu dashboard, lalu katalog, lalu checkout, lalu tracking. Alur ini menentukan data apa yang harus dibawa antar halaman (sesi, keranjang, pesanan).
3. **Pilih penyimpanan.** Karena tidak ada server, `localStorage` dipakai supaya pesanan dari checkout bisa muncul di laporan, history, dan tracking.
4. **Bangun HTML dulu, lalu CSS, lalu JS.** Kerangka semantik dibuat lebih dulu, tema visual menyusul, dan interaksi terakhir.
5. **Tema visual.** Warna hijau pinus dan kuning dipilih agar terasa seperti rak buku. Halaman login menampilkan punggung buku dengan kode barang asli dari katalog.
6. **Validasi di setiap input.** Setiap form memberi umpan balik yang jelas tentang apa yang salah dan cara memperbaikinya.
7. **Kreativitas tambahan.** Tema khusus, progress bar bertahap pada tracking, pencarian katalog, laporan dan history, serta tampilan responsif.

## 9. Kendala dan Solusi

| Kendala | Solusi |
|---|---|
| Path cover PAUD di `data.js` memakai `.jpeg` padahal file `.jpg`, sehingga gambar tidak tampil | Ekstensi di `data.js` disamakan menjadi `.jpg`, dan ada placeholder huruf jika gambar gagal dimuat |
| Ada typo tanggal (`"2025-08 25 ..."`) dan jam kembar pada data tracking | Data dirapikan agar urutan waktu perjalanan benar |
| Data harus berpindah antar halaman tanpa server | Memakai `localStorage` dengan fungsi `load()` dan `save()` yang aman dari error |
| Status "Dikirim" pada data tetapi riwayat sudah "Selesai Antar" | Status ditampilkan sebagai "Diterima" jika catatan terakhir menyatakan paket selesai diantar |
| Soal menulis `login.html` dan `index.html` sekaligus | Halaman login memakai `index.html` sesuai struktur folder |

---

_Dibuat untuk memenuhi tugas UTS Pemrograman Web 1._
