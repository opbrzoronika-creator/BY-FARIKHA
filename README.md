# WCC.BYFARIHA — Website + Owner Dashboard

Starter website responsif untuk Wedding & Event Content Creator. Dibuat agar pemilik dapat mengubah konten tanpa mengedit kode.

## Fitur saat ini
- Halaman publik: Home, About, Services, Packages, Portfolio, Reviews, Contact.
- Dashboard pemilik: kelola paket/harga, portfolio melalui URL media, testimoni, profil, WhatsApp, Instagram, area layanan.
- Semua paket awal bernilai Rp0 dan dapat diubah melalui dashboard.
- Login email/password dengan Supabase Auth.
- RLS: hanya user yang terdaftar sebagai owner dapat mengubah data.
- Desain responsif untuk HP dan laptop.

## 1. Buat proyek Supabase
1. Buat proyek di https://supabase.com/
2. Buka SQL Editor, jalankan seluruh isi `supabase/schema.sql`.
3. Buka Project Settings > API. Salin Project URL dan anon/publishable key.
4. Isi nilai tersebut di `js/config.js`. Jangan pernah memasukkan `service_role` key.

## 2. Buat akun pemilik
1. Di Supabase buka Authentication > Users > Add user.
2. Buat satu akun email dan password milik pemilik.
3. Salin UUID user tersebut.
4. Jalankan SQL berikut di SQL Editor, ganti UUID dengan UUID akun tadi:

```sql
insert into public.profiles(id, role)
values ('GANTI-DENGAN-UUID-AKUN-PEMILIK', 'owner');
```

Jangan membuat tautan pendaftaran publik. Hanya buat satu akun pemilik. Aktifkan verifikasi email bila sesuai kebutuhan.

## 3. Uji lokal
Buka folder ini melalui Antigravity atau editor lain. Untuk pengujian, jalankan server lokal (misalnya Live Server). Jangan hanya membuka file HTML dengan double-click karena beberapa fitur browser memerlukan server.

## 4. Publikasikan melalui GitHub Pages
1. Buat repository GitHub baru.
2. Upload semua isi folder proyek ke root repository.
3. Pastikan repository tidak berisi password, service_role key, atau data pelanggan.
4. Settings > Pages > Deploy from a branch > pilih `main` dan `/ (root)` > Save.
5. Tunggu deployment selesai, lalu buka URL yang diberikan GitHub.

## 5. Cara mengelola
Buka `https://ALAMAT-WEBSITE/admin/login.html`, masuk dengan akun pemilik.
- Pricelist: tambah/edit/hapus paket, semua harga dalam Rupiah.
- Portfolio: masukkan URL foto atau video publik. Untuk versi ini file tidak diunggah langsung; tautan media harus dapat diakses publik.
- Testimoni: tambah/hapus.
- Profil & Kontak: edit teks, nomor WhatsApp format 62..., Instagram, dan area layanan.

## Catatan penting sebelum dipakai sungguhan
- Starter ini belum mengunggah file foto/video langsung ke Supabase Storage. Portfolio menggunakan URL media.
- Fitur edit/hapus tersedia untuk paket; portfolio dan testimoni dapat ditambah/hapus. Untuk mengubah item portfolio/testimoni yang sudah ada, hapus lalu tambahkan ulang.
- Nomor WhatsApp belum diisi. Masukkan nomor pemilik melalui Dashboard.
- Ganti foto hero placeholder dengan foto milik sendiri pada pengembangan berikutnya.
- Periksa RLS dan uji dengan akun pemilik serta sesi pengunjung sebelum memasukkan data pelanggan.
- Jangan publikasikan informasi pribadi pasangan/klien tanpa izin.
- Ini adalah starter operasional yang perlu dikonfigurasi dan diuji; belum live hanya dengan mengekstrak ZIP.
