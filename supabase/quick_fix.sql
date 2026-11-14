-- ==============================================================================
-- WCC.BYFARIHA — SQL SINGKAT: AKTIVASI IZIN ULASAN KONSUMEN & RESERVASI PUBLIK
-- Jalankan skrip ini sekali di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kydadeazbxyrdicrofzt/sql
-- ==============================================================================

-- 1. Berikan izin bagi pengunjung publik untuk mengirim ulasan (status default: nonaktif/menunggu persetujuan)
drop policy if exists "public insert reviews" on public.reviews;
create policy "public insert reviews" on public.reviews 
  for insert to anon, authenticated 
  with check (true);

-- 2. Berikan izin bagi pengunjung publik untuk mengirim reservasi tanggal (bookings)
drop policy if exists "public insert bookings" on public.bookings;
create policy "public insert bookings" on public.bookings 
  for insert to anon, authenticated 
  with check (true);

-- 3. Pastikan kolom pendukung ulasan & pengaturan teks tersedia di database
alter table public.reviews add column if not exists venue text default '';
alter table public.reviews add column if not exists rating int default 5;
alter table public.reviews alter column is_active set default false;

alter table public.site_settings add column if not exists hero_title text default 'Abadikan Janji Suci, Keanggunan Abadi.';
alter table public.site_settings add column if not exists about_title text default 'Sentuhan Editorial dalam Setiap Rekaman Emosi';
alter table public.site_settings add column if not exists device_text text default 'Eksklusif iPhone Pro 4K 60fps HDR · Penyerahan File 24 Jam';
alter table public.site_settings add column if not exists footer_quote text default '“Mengabadikan keindahan kisah cinta Anda dengan kemewahan yang tenang dan keanggunan abadi.”';
