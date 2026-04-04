# Romeo & Juliet | Website Pernikahan Ethereal Editorial

Selamat datang di dokumentasi untuk website pernikahan eksklusif Anda. Proyek ini mengusung filosofi desain "Ethereal Editorial", yang berfokus pada tipografi yang bersih, layout asimetris, dan interaksi pengguna yang premium.

---

## 🎨 Filosofi Desain: "Ethereal Editorial"
Website ini dibangun menggunakan palet warna yang dikurasi khusus: **Rose (#894e56)**, **Olive Gold (#7a5a00)**, dan **Cream (#fbf9f5)**. Menggunakan perpaduan antara **Noto Serif** yang elegan untuk judul dan **Manrope** yang modern untuk teks isi dan label, menciptakan nuansa yang mirip dengan majalah gaya hidup mewah.

---

## 📸 Showcase Visual
*Di bawah ini adalah bagian inti dari website. Anda dapat mengganti path placeholder dengan screenshot Anda sendiri.*

### 1. Hero & Branding
Kesan pertama bagi tamu Anda, menampilkan latar belakang parallax full-bleed dan elemen hati yang melayang secara interaktif.

![Tampilan Desktop Hero](images/screenshots/hero-desktop.png)
*Placeholder: Bagian Hero Desktop*

### 2. Sistem RSVP Digital
Layout dua kolom simetris yang memungkinkan tamu untuk mengonfirmasi kehadiran mereka dan meninggalkan pesan yang menyentuh hati.

![Bagian RSVP](images/screenshots/rsvp-section.png)
*Placeholder: Formulir RSVP & Ucapan Tamu*

### 3. Wedding Gift (Asimetris)
Grid 12-kolom yang canggih menampilkan kartu QRIS dengan efek transisi grayscale-ke-warna dan baris transfer bank yang elegan.

![Bagian Wedding Gift](images/screenshots/gift-section.png)
*Placeholder: Layout Bagian Hadiah*

---

## ✨ Fitur & Fungsionalitas Utama

### 📝 Manajemen RSVP
- **Daftar Dinamis**: Saat tamu mengirimkan respons, data akan langsung ditambahkan ke daftar "Recent Responses" tanpa perlu memuat ulang halaman.
- **Validasi Formulir**: Memastikan semua field yang diperlukan (Nama, Kehadiran, dll.) diisi dengan benar.
- **Tampilan Kosong**: Menampilkan pesan "Jadilah yang pertama untuk merespons" jika belum ada tamu yang membalas.

### 💳 Wedding Gift Modern
- **QRIS Interaktif**: Kode QR tampil minimalis/grayscale secara default dan menjadi berwarna saat kursor diarahkan (hover) untuk kesan interaktif.
- **Fitur Salin Nomor**: Tombol "SALIN NOMOR" sekali klik untuk akun bank.
- **Notifikasi Toast**: Notifikasi pop-up gelap yang halus memberikan feedback instan saat nomor rekening berhasil disalin.

### 📱 Keunggulan Responsif
- Dioptimalkan sepenuhnya untuk perangkat seluler.
- Bagian layout akan otomatis menumpuk secara vertikal pada layar yang lebih kecil (di bawah 992px) untuk menjaga keterbacaan.
- **Perlindungan Horizontal**: Keamanan `overflow-x` bawaan untuk mencegah adanya "celah putih" di samping saat di-scroll.

---

## 🛠️ Panduan Kustomisasi

### 1. Mengubah Nama & Tanggal
Buka `index.html` dan cari:
- `Romeo & Juliet` (Ganti dengan nama pasangan)
- `December 31, 2024` (Ganti dengan tanggal pernikahan)

### 2. Memperbarui Detail Bank
Cari bagian `gift-section` di `index.html` dan perbarui nomor rekening baik di teks maupun di fungsi `copyToClipboard()`:
```html
<button class="copy-btn-refined" onclick="copyToClipboard('NOMOR_ANDA_DI_SINI', this)">
```

### 3. Menyesuaikan Warna
Buka `css/main.css` dan cari penanda **GIFT SECTION REFINED** atau **RSVP SECTION**. Anda dapat mengubah kode hex untuk:
- `--primary-rose`: `#894e56`
- `--primary-gold`: `#7a5a00`
- `--surface-container`: `#f5f4ef`

---

## 🏗️ Stack Teknologi
- **Struktur**: Elemen Semantik HTML5
- **Gaya (Styling)**: Vanilla CSS (Modern Grid & Flexbox)
- **Logika**: Vanilla JavaScript (Async/ES6+)
- **Ikon**: Material Symbols Outlined

---

*Terima kasih telah memercayai saya untuk membantu membangun kehadiran digital di hari spesial Anda!*
