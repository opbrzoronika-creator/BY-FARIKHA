# WCC.BYFARIHA — Luxury Editorial Wedding & Event Content Creator

Website resmi dan Owner Dashboard untuk **WCC.BYFARIHA** bergaya **Luxury Editorial Wedding**. Memadukan estetika majalah pernikahan kelas atas dengan kemudahan pengelolaan konten mandiri tanpa menyentuh kode.

---

## 🎨 Konsep Visual & Palet Warna
- **Charcoal / Hitam Elegan** (`#141312`, `#0d0c0b`): Nuansa kemewahan, kedalaman kontras, dan ketenangan editorial.
- **Terracotta / Burnt Orange** (`#b85d38`, `#cb6b44`): Aksen kehangatan romantis, tombol utama (CTA), dan sorotan interaktif.
- **Warm Ivory** (`#faf6f0`, `#e8dfd2`): Tipografi bersih dan ramah mata layaknya halaman majalah cetak mewah.
- **Aksen Champagne Gold** (`#d8b788`, `#f4e8d4`): Garis pembatas halus, ornamen cap stempel estetis, dan bintang review.

---

## 🏛️ Struktur Website (6 Bagian Utama)
1. **Beranda (Home)**: Hero berukuran penuh, tipografi editorial mewah, animasi multi-layer parallax, stamp badge berputar lambat, dan ticker informasi layanan (4K 60fps, 24H Delivery).
2. **Booking**: Formulir pemesanan interaktif (Nama, No. WhatsApp, Tanggal Acara, Venue/Lokasi, Pilihan Paket, Catatan) yang langsung terintegrasi dengan pembuat pesan WhatsApp resmi terformat rapi.
3. **Pricelist**: Kartu paket dinamis dengan fasilitas lengkap, badge "RECOMMENDED", format Rupiah, dan tombol "Pilih Paket" yang otomatis mengisi form booking.
4. **Portfolio**: Galeri arsip foto dan video dengan tab filter (Semua, Foto, Video), efek hover zoom, dan lightbox/modal preview interaktif.
5. **About**: Filosofi brand, manifesto editorial, serta pilar keunggulan (Discreet & Intimate, Cinematic 4K, Speed & Completeness).
6. **Reviews**: Testimoni tulus dari pasangan pengantin dalam tata letak kutipan editorial beraksen champagne.

---

## ✨ Fitur Animasi
- **Parallax Multi-Layer**: Gerakan lambat pada latar ambient glow dan bingkai foto hero mengikuti scroll pengguna.
- **Smooth Scroll Reveals**: Teks dan kartu muncul bertahap (*staggered fade-up*) saat digulir ke viewport via IntersectionObserver.
- **Hover Transitions**: Skala lembut pada foto, glow border champagne pada kartu paket dan galeri.
- **Rotasi Lambat**: Stempel badge editorial berputar 360° secara halus.

---

## 📱 Owner Dashboard (HP & PC)
Pemilik dapat masuk ke `/admin/login.html` untuk:
- Mengubah, menambah, atau menghapus paket harga.
- Menambah foto dan video portofolio.
- Menambah review dan testimoni klien baru.
- Mengatur deskripsi hero, about, nomor WhatsApp resmi, dan tautan Instagram.

---

## 🚀 Panduan Setup Supabase
1. Buat proyek baru di [Supabase](https://supabase.com/).
2. Buka **SQL Editor**, lalu jalankan seluruh isi file `supabase/schema.sql`.
3. Buka **Project Settings** > **API**, salin `Project URL` dan `anon key`.
4. Tempelkan kredensial tersebut ke file `js/config.js`:
   ```javascript
   window.SUPABASE_URL = "https://xxxx.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJh......";
   ```
5. Buat akun pemilik di menu **Authentication** > **Users** > **Add User**.
6. Masukkan UUID akun tersebut ke tabel `profiles` via SQL Editor:
   ```sql
   insert into public.profiles(id, role)
   values ('UUID-AKUN-PEMILIK-ANDA', 'owner');
   ```

---

## 🌐 Publikasi ke GitHub Pages
1. Pastikan seluruh perubahan sudah di-commit dan di-push ke GitHub.
2. Di GitHub, buka **Settings** > **Pages**.
3. Pada **Build and deployment**, pilih Source: `Deploy from a branch`, Branch: `main`, Folder: `/ (root)`.
4. Klik **Save** dan website Anda akan aktif secara publik.
