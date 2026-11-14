-- ==============================================================================
-- WCC.BYFARIHA — Skema Database & Kebijakan Keamanan Supabase
-- ==============================================================================
-- Jalankan seluruh script SQL ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<PROJECT_ID>/sql
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. TABEL PROFIL PEMILIK (PROFILES)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner')),
  created_at timestamptz not null default now()
);

-- 2. TABEL PAKET HARGA & LAYANAN (PACKAGES)
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price bigint not null default 0 check (price >= 0),
  description text default '',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. TABEL ARSIP PORTOFOLIO (PORTFOLIO)
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('image','video')),
  media_url text not null,
  description text default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. TABEL TESTIMONI KLIEN (REVIEWS)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. TABEL PENGATURAN SITUS (SITE_SETTINGS)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_text text default 'Menangkap setiap tatapan, senyuman, dan momen sakral hari bahagia Anda dalam balutan estetika editorial sinematik 4K yang berkelas dan abadi.',
  about_text text default 'WCC.BYFARIHA hadir untuk setiap pasangan yang menginginkan dokumentasi pernikahan bernilai seni tinggi. Kami memadukan kehangatan momen intim dengan visual berkelas layaknya editorial majalah pernikahan dunia.',
  whatsapp_number text default '6285700000000',
  instagram_url text default 'https://www.instagram.com/wcc.byfariha/',
  area_text text default 'Magetan, Madiun, Solo, Surabaya & Seluruh Indonesia'
);

-- 6. TABEL FORMULIR RESERVASI (BOOKINGS)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  whatsapp_number text not null,
  event_date date not null,
  location text not null,
  package_name text not null,
  notes text default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- FUNGSI VALIDASI PEMILIK (IS_OWNER)
-- ==============================================================================
create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ 
  select exists(
    select 1 from public.profiles 
    where id = auth.uid() and role = 'owner'
  ); 
$$;

-- ==============================================================================
-- KEBIJAKAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.portfolio enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;
alter table public.bookings enable row level security;

-- Kebijakan Profiles
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles 
  for select to authenticated 
  using (id = auth.uid());

drop policy if exists "owner manage profiles" on public.profiles;
create policy "owner manage profiles" on public.profiles 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- Kebijakan Packages
drop policy if exists "public read active packages" on public.packages;
create policy "public read active packages" on public.packages 
  for select to anon, authenticated 
  using (is_active = true);

drop policy if exists "owner manage packages" on public.packages;
create policy "owner manage packages" on public.packages 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- Kebijakan Portfolio
drop policy if exists "public read active portfolio" on public.portfolio;
create policy "public read active portfolio" on public.portfolio 
  for select to anon, authenticated 
  using (is_active = true);

drop policy if exists "owner manage portfolio" on public.portfolio;
create policy "owner manage portfolio" on public.portfolio 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- Kebijakan Reviews
drop policy if exists "public read active reviews" on public.reviews;
create policy "public read active reviews" on public.reviews 
  for select to anon, authenticated 
  using (is_active = true);

drop policy if exists "owner manage reviews" on public.reviews;
create policy "owner manage reviews" on public.reviews 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- Kebijakan Site Settings
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings 
  for select to anon, authenticated 
  using (true);

drop policy if exists "owner manage settings" on public.site_settings;
create policy "owner manage settings" on public.site_settings 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- Kebijakan Bookings
drop policy if exists "public insert bookings" on public.bookings;
create policy "public insert bookings" on public.bookings 
  for insert to anon, authenticated 
  with check (true);

drop policy if exists "owner manage bookings" on public.bookings;
create policy "owner manage bookings" on public.bookings 
  for all to authenticated 
  using (public.is_owner()) 
  with check (public.is_owner());

-- ==============================================================================
-- STORAGE BUCKET: wcc-portfolio & KEBIJAKAN KEAMANAN FILE
-- ==============================================================================
-- Buat bucket penyimpanan wcc-portfolio jika belum tersedia
insert into storage.buckets (id, name, public)
values ('wcc-portfolio', 'wcc-portfolio', true)
on conflict (id) do update set public = true;

-- Publik dapat melihat / memuat gambar & video dari bucket wcc-portfolio
drop policy if exists "public view wcc-portfolio" on storage.objects;
create policy "public view wcc-portfolio" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'wcc-portfolio');

-- Hanya pemilik (owner) yang dapat mengunggah berkas ke bucket wcc-portfolio
drop policy if exists "owner upload wcc-portfolio" on storage.objects;
create policy "owner upload wcc-portfolio" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'wcc-portfolio' and public.is_owner());

-- Hanya pemilik yang dapat memperbarui berkas di bucket wcc-portfolio
drop policy if exists "owner update wcc-portfolio" on storage.objects;
create policy "owner update wcc-portfolio" on storage.objects
  for update to authenticated
  using (bucket_id = 'wcc-portfolio' and public.is_owner());

-- Hanya pemilik yang dapat menghapus berkas dari bucket wcc-portfolio
drop policy if exists "owner delete wcc-portfolio" on storage.objects;
create policy "owner delete wcc-portfolio" on storage.objects
  for delete to authenticated
  using (bucket_id = 'wcc-portfolio' and public.is_owner());

-- ==============================================================================
-- DATA AWAL STANDAR (Bila Tabel Masih Kosong)
-- ==============================================================================
insert into public.packages (name, price, description, is_featured, sort_order)
select 'Paket Intimate Wedding', 2500000, 
  'Liputan 4–5 Jam (Akad Nikah / Pemberkatan)
1 Kreator Konten Berpengalaman
2 Video Cinematic Reels Siap Tayang (4K 60fps HDR)
Semua Video Mentah & Foto Diserahkan dalam 24 Jam
Perangkat Flagship Kamera Ultra-Jernih
Tautan Galeri Pribadi Google Drive', false, 1
where not exists (select 1 from public.packages where sort_order = 1);

insert into public.packages (name, price, description, is_featured, sort_order)
select 'Paket Grand Wedding (Full Day)', 4500000, 
  'Liputan Penuh Hari H (Hingga 10 Jam: Persiapan s.d. Resepsi)
1 Kreator Konten Khusus yang Dedikatif
4 Video Cinematic Reels (Teaser & Sorotan Utama)
Same-Day Edit (1 Video siap tayang dalam 12 jam)
Dokumentasi Estetis Di Balik Layar (Behind-the-Scenes)
Seluruh File Mentah Tanpa Kompresi dalam 24 Jam
Konsultasi Konsep Konten Langsung via WhatsApp', true, 2
where not exists (select 1 from public.packages where sort_order = 2);

insert into public.packages (name, price, description, is_featured, sort_order)
select 'Paket Luxury Editorial (All-In)', 6800000, 
  'Liputan Penuh Komprehensif (Waktu Fleksibel Tak Terbatas)
2 Kreator Konten Profesional di Lokasi
6 Video Reels Editorial Mewah + 1 Video Rekap Panjang
Same-Day Edit (2 Video Reels siap posting di hari yang sama)
Dokumentasi Di Balik Layar Lengkap & Wawancara Tamu
Koleksi Foto Carousel dengan Color Grading Majalah
Penyerahan File Mentah Instan via AirDrop / Hard Drive
Tersedia untuk Pernikahan Luar Kota & Luar Pulau', false, 3
where not exists (select 1 from public.packages where sort_order = 3);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
