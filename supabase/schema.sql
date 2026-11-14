-- Jalankan seluruh SQL ini di Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner'))
);
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
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('image','video')),
  media_url text not null,
  description text default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_text text default 'Mengabadikan momen istimewa menjadi cerita indah yang bisa dikenang selamanya.',
  about_text text default 'WCC.BYFARIHA hadir untuk menangkap detail, emosi, dan momen berharga di hari spesialmu melalui konten wedding yang hangat dan berkesan.',
  whatsapp_number text default '',
  instagram_url text default 'https://www.instagram.com/wcc.byfariha/',
  area_text text default 'Magetan, Ponorogo, Ngawi, Madiun, Wonogiri, Karanganyar, Sragen dan sekitarnya.'
);
-- Admin dibuat secara manual lewat Authentication > Users.
-- Setelah user dibuat, jalankan INSERT di bagian README memakai UUID user tersebut.

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'owner'); $$;

alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.portfolio enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "owner read own profile" on public.profiles;
create policy "owner read own profile" on public.profiles for select to authenticated using (id = auth.uid() and role = 'owner');
drop policy if exists "public read active packages" on public.packages;
create policy "public read active packages" on public.packages for select to anon, authenticated using (is_active = true);
drop policy if exists "owner manage packages" on public.packages;
create policy "owner manage packages" on public.packages for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "public read active portfolio" on public.portfolio;
create policy "public read active portfolio" on public.portfolio for select to anon, authenticated using (is_active = true);
drop policy if exists "owner manage portfolio" on public.portfolio;
create policy "owner manage portfolio" on public.portfolio for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "public read active reviews" on public.reviews;
create policy "public read active reviews" on public.reviews for select to anon, authenticated using (is_active = true);
drop policy if exists "owner manage reviews" on public.reviews;
create policy "owner manage reviews" on public.reviews for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "owner manage settings" on public.site_settings;
create policy "owner manage settings" on public.site_settings for all to authenticated using (public.is_owner()) with check (public.is_owner());

insert into public.packages(name,price,description,is_featured,sort_order)
select 'Package 01',0,'Fasilitas paket akan diisi oleh pemilik.',false,1
where not exists(select 1 from public.packages);
insert into public.packages(name,price,description,is_featured,sort_order)
select 'Package 02',0,'Fasilitas paket akan diisi oleh pemilik.',false,2
where (select count(*) from public.packages)<2;
insert into public.packages(name,price,description,is_featured,sort_order)
select 'Package 03',0,'Fasilitas paket akan diisi oleh pemilik.',false,3
where (select count(*) from public.packages)<3;
insert into public.site_settings(id) values(1) on conflict(id) do nothing;

-- Catatan: buat akun pemilik di Supabase Auth, lalu tambahkan UUID-nya ke profiles.
