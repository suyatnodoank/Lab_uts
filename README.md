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

<img width="899" height="570" alt="1  Menyiapkan folder" src="https://github.com/user-attachments/assets/fccc6346-ea66-44af-958e-86fddb23d16b" />

### 6.2 Halaman Login (`index.html`)

**a. Sebelum menggunakan css**
<img width="1855" height="948" alt="3  halaman Login sebelum menggunakan css" src="https://github.com/user-attachments/assets/8d6032bb-e5b6-4b54-94b0-c604435365c3" />
**b. Mempercantik Background**
<img width="1911" height="1018" alt="4   dibalut sedikit css" src="https://github.com/user-attachments/assets/e72fecee-4561-49b3-95dd-481f22598403" />
**c.  Mempercantik Form login**
<img width="1855" height="987" alt="5  Menggunakan css" src="https://github.com/user-attachments/assets/49d5c565-d794-420f-87c8-bf195df95524" />

Halaman login memiliki input email dan password serta tombol **Login**. Data dicocokkan dengan array `dataPengguna` di `data.js` (ditambah akun yang didaftarkan lewat modal Daftar). Jika salah, muncul pop-up berisi pesan *"Email/password yang anda masukkan salah"*.

**a. Tampilan awal**

<img width="1305" height="1032" alt="image" src="https://github.com/user-attachments/assets/e413e08b-f2e0-4c8c-aa89-86ff8f1fece4" />


**b. Validasi field kosong / format email salah**

<img width="921" height="1032" alt="(fitur) Kosong" src="https://github.com/user-attachments/assets/ff842d92-19bd-4bce-b54a-0639494cb2b6" />

**c. Login gagal (pop-up error)**

<img width="1002" height="949" alt="(fitur)pop up login gagal" src="https://github.com/user-attachments/assets/4cf9178f-1b2f-49d0-a330-1b4869d0e03b" />
**d. Fitur Lupa Password**

Pengguna memasukkan email. Sistem memeriksa apakah email terdaftar, lalu menampilkan pop-up konfirmasi (simulasi pengiriman tautan reset).

<img width="918" height="1035" alt="(fitur) fitur lupa password" src="https://github.com/user-attachments/assets/6db315cf-2b38-4b80-823e-257c6a0ca210" />
**e. Fitur Daftar**

Form pendaftaran divalidasi (nama minimal 3 karakter, email valid dan belum terdaftar, password minimal 6 karakter, konfirmasi password harus sama). Akun baru disimpan di `localStorage`.

<img width="912" height="1030" alt="(fitur)daftar" src="https://github.com/user-attachments/assets/7422db04-e344-4d7f-91a1-369e07e359d4" />
### 6.3 Dashboard (`dashboard.html`)

Dashboard menampilkan *greeting* berdasarkan jam lokal perangkat (pagi, siang, sore, atau malam) beserta tanggal dan jam yang berjalan. Ada empat menu utama: Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, dan History Transaksi.

<img width="1919" height="996" alt="2 1 dashboard html" src="https://github.com/user-attachments/assets/302e7859-ebc6-4d8d-9117-7c0555357c88" />
**Laporan Pemesanan** menghitung ringkasan (jumlah pesanan, total buku, total pembayaran) dan rekap per judul dari data pesanan.

<img width="1393" height="1035" alt="image" src="https://github.com/user-attachments/assets/cdd461a1-802f-46a8-a334-c8cf0c48eee4" />


**History Transaksi** menampilkan daftar semua pesanan beserta link ke halaman tracking.

<img width="914" height="1032" alt="(fitur)history transaksi" src="https://github.com/user-attachments/assets/b8a6d50a-20fe-4df9-ad9f-1d1f2765060d" />
### 6.4 Informasi Stok / Katalog (`stok.html`)

Tabel dibuat secara dinamis dari variabel `dataKatalogBuku` dengan `createElement` (tanpa menulis baris tabel manual di HTML). Stok di bawah 200 eksemplar ditandai merah, dan ada kolom pencarian.

**a. Tabel katalog**

<img width="1860" height="986" alt="2 3 Stok html" src="https://github.com/user-attachments/assets/99fdbc19-e67b-40a3-bc0c-6f213520ae72" />

### 6.5 Halaman Pemesanan (`checkout.html`)

Halaman ini menampilkan data pemesanan yang bisa ditambah, diubah jumlahnya, dan dihapus, serta isian informasi pemesan dan pembayaran.

**a. Keranjang berisi buku dari katalog**

<img width="737" height="702" alt="image" src="https://github.com/user-attachments/assets/d71e6d7a-7f15-4ab4-a684-dab7dc34dadf" />

**b. Validasi form pemesan dan pembayaran**

Nama, email, nomor HP (format Indonesia), alamat, ekspedisi, dan metode pembayaran divalidasi. Total bayar dihitung otomatis (subtotal ditambah ongkos kirim sesuai ekspedisi).

<img width="887" height="1034" alt="image" src="https://github.com/user-attachments/assets/2798ef62-5864-4380-97ae-cfd7807f24a7" />

**c. Pesanan berhasil dan nomor DO**

Pesanan disimpan, stok buku berkurang, dan pengguna menerima nomor DO untuk dilacak.

<img width="877" height="1036" alt="image" src="https://github.com/user-attachments/assets/c539edca-2178-4395-bdcf-67b6e7e3df1e" />

### 6.6 Informasi Pengiriman (`tracking.html`)

Pengguna memasukkan Nomor Delivery Order lalu menekan **Cari**. Sistem mencari di `dataTracking` (dan pesanan baru dari checkout), lalu menampilkan nama pemesan, status pengiriman (progress bar dan tahapan), detail ekspedisi, tanggal kirim, jenis paket, total pembayaran, serta riwayat perjalanan.

**a. Hasil pencarian DO `20230012`**

<img width="879" height="1027" alt="image" src="https://github.com/user-attachments/assets/761b60c4-cf7a-4cf0-a339-f9e2900b382d" />

**b. Nomor DO tidak ditemukan / input tidak valid**

<img width="876" height="1033" alt="image" src="https://github.com/user-attachments/assets/5d49d158-402d-49ee-a8ec-36db7a6e1116" />

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
