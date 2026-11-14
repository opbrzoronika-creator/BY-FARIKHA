# WCC.BYFARIHA — Luxury Editorial Wedding & Event Content Creator

Website resmi dan Dashboard Pemilik untuk **WCC.BYFARIHA** bergaya **Luxury Editorial Wedding** yang terintegrasi penuh dengan **Supabase Database, Supabase Authentication, dan Supabase Storage (`wcc-portfolio`)**.

---

## 🎨 Konsep Visual & Palet Warna
- **Charcoal / Hitam Elegan** (`#121110`, `#1a1817`): Nuansa kemewahan, kedalaman kontras, dan ketenangan editorial.
- **Terracotta / Burnt Orange** (`#b85d38`, `#cf6b42`): Aksen kehangatan romantis, tombol utama (CTA), dan floating WhatsApp button.
- **Warm Ivory** (`#faf6f0`, `#faf7f2`): Tipografi bersih dan ramah mata pada mode gelap maupun mode terang.
- **Aksen Champagne Gold** (`#d8b788`, `#f5e8d5`): Garis pembatas halus, ornamen cap stempel berputar, dan bintang ulasan.

---

## 🏛️ Struktur Website & Integrasi Database
1. **Beranda (Home)**: Hero berukuran penuh, tipografi editorial mewah, animasi multi-layer parallax, stamp badge berputar lambat, dan ticker berjalan. Mengambil teks headline & area dari tabel `site_settings`.
2. **Tentang Kami (About)**: Filosofi brand, 3 pilar keunggulan (*Tenang & Tidak Mengganggu*, *Sinematik 4K 60fps*, *Cepat 24 Jam*).
3. **Paket Layanan (Pricelist)**: Kartu paket dinamis dari tabel `packages`, format Rupiah, badge rekomendasi utama, dan tombol "Pilih Paket Ini".
4. **Portofolio**: Galeri arsip foto dan video dari tabel `portfolio` dan berkas di Supabase Storage bucket `wcc-portfolio`. Dilengkapi tab filter dan lightbox modal.
5. **Ulasan Klien (Reviews)**: Testimoni tulus dari tabel `reviews` dalam tata letak kutipan editorial beraksen champagne.
6. **Formulir Reservasi (Bookings)**: Formulir pemesanan interaktif yang menyimpan data langsung ke tabel `bookings` dan secara otomatis membuka WhatsApp resmi dengan format pesan yang rapi.
7. **Dashboard Pemilik (Admin)**: Khusus akun dengan role `owner` pada tabel `profiles`. Dapat mengelola paket harga, mengunggah foto/video ke Storage bucket `wcc-portfolio`, mengelola testimoni, memantau reservasi masuk, serta mengubah profil dan kontak.

---

## 🔐 Keamanan & Akses Data (Row Level Security)
- **Kredensial Frontend**: Hanya menggunakan **Project URL** dan **Anon / Publishable Key**. `service_role` key dilarang keras untuk digunakan di sisi frontend.
- **Akses Publik (Tanpa Login)**:
  - Pengunjung dapat melihat paket aktif (`is_active = true`), portofolio aktif, ulasan aktif, dan informasi situs.
  - Pengunjung dapat mengirimkan reservasi ke tabel `bookings` tanpa login.
- **Akses Pemilik (Dashboard Admin)**:
  - Autentikasi menggunakan Supabase Auth (Email & Password).
  - Sistem memvalidasi apakah akun memiliki `role = 'owner'` di tabel `profiles`. Jika bukan pemilik, sesi langsung ditolak dan dikeluarkan (*sign out*).
  - Hanya pemilik yang dapat menambah, mengedit, dan menghapus paket, portofolio, berkas di Storage bucket `wcc-portfolio`, ulasan, serta mengubah status reservasi.

---

## 🚀 Panduan Setup & Integrasi Supabase

### 1. Jalankan Skema Database & Storage
1. Buka dashboard proyek Anda di [Supabase](https://supabase.com/).
2. Masuk ke menu **SQL Editor**.
3. Buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, dan jalankan (Run) di SQL Editor Supabase.
   Script ini secara otomatis membuat:
   - Tabel `profiles`, `packages`, `portfolio`, `reviews`, `site_settings`, `bookings`
   - Storage bucket `wcc-portfolio` (Public)
   - Kebijakan keamanan RLS lengkap untuk publik dan pemilik
   - Data awal standar

### 2. Atur Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka `.env` dan `js/config.js`, lalu masukkan **Project URL** dan **anon key** dari menu **Project Settings > API**:
```env
SUPABASE_URL=https://proyek-anda.supabase.co
SUPABASE_ANON_KEY=eyJh......
```
> [!CAUTION]
> Jangan pernah memasukkan `service_role` key! Cukup gunakan `anon` / `publishable` key.

### 3. Buat Akun Pemilik (Owner)
1. Di dashboard Supabase, buka **Authentication** > **Users** > klik **Add User** > **Create User**.
2. Masukkan email dan password pemilik (misal: `owner@wccbyfariha.com`).
3. Salin **User UID** yang terbentuk.
4. Buka kembali **SQL Editor**, lalu jalankan SQL berikut (ganti dengan UID akun Anda):
```sql
insert into public.profiles (id, role)
values ('GANTI-DENGAN-UID-PEMILIK-ANDA', 'owner')
on conflict (id) do update set role = 'owner';
```

### 4. Masuk ke Dashboard Pemilik
1. Buka `admin/login.html` di browser Anda.
2. Masuk menggunakan email dan password pemilik yang telah didaftarkan.
3. Anda akan dialihkan ke Dashboard untuk mulai mengelola website!

---

## 🌐 Publikasi ke GitHub Pages
1. Pastikan seluruh perubahan sudah di-commit dan di-push ke GitHub:
   ```bash
   git add .
   git commit -m "Integrasi Supabase: Database, Auth, Storage wcc-portfolio, dan Bookings"
   git push origin main
   ```
2. Di repositori GitHub, buka **Settings** > **Pages**.
3. Pada **Build and deployment**, pilih Source: `Deploy from a branch`, Branch: `main`, Folder: `/ (root)`.
4. Klik **Save**. Website Anda akan aktif secara publik.
