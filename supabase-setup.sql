-- ============================================================================
-- Frames by Hari — Supabase Setup
-- Paste this entire file into Supabase Dashboard → SQL Editor → "New query" → Run
-- Safe to re-run; uses IF NOT EXISTS / ON CONFLICT where possible.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  unique (category_id, name)
);

create table if not exists public.photos (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references public.categories(id) on delete cascade,
  subcategory_id  uuid     references public.subcategories(id) on delete set null,
  title           text,
  storage_path    text not null,
  aspect_ratio    text not null default 'portrait', -- 'portrait' | 'landscape' | 'square'
  is_featured     boolean not null default false,
  sort_order      int  not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists photos_category_idx on public.photos(category_id);
create index if not exists photos_subcategory_idx on public.photos(subcategory_id);

-- ---------------------------------------------------------------------------
-- 2. Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.categories     enable row level security;
alter table public.subcategories  enable row level security;
alter table public.photos         enable row level security;

drop policy if exists "public read categories"     on public.categories;
drop policy if exists "auth write categories"      on public.categories;
drop policy if exists "public read subcategories"  on public.subcategories;
drop policy if exists "auth write subcategories"   on public.subcategories;
drop policy if exists "public read photos"         on public.photos;
drop policy if exists "auth write photos"          on public.photos;

create policy "public read categories"
  on public.categories for select using (true);
create policy "auth write categories"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read subcategories"
  on public.subcategories for select using (true);
create policy "auth write subcategories"
  on public.subcategories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "public read photos"
  on public.photos for select using (true);
create policy "auth write photos"
  on public.photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 3. Storage bucket for photos (public-read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "public read photos bucket"  on storage.objects;
drop policy if exists "auth upload photos bucket"  on storage.objects;
drop policy if exists "auth update photos bucket"  on storage.objects;
drop policy if exists "auth delete photos bucket"  on storage.objects;

create policy "public read photos bucket"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "auth upload photos bucket"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "auth update photos bucket"
  on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "auth delete photos bucket"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 4. Seed initial categories + subcategories
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, sort_order) values
  ('portraits',  'Portraits',          'Capturing the raw emotion and authentic presence of individuals.', 1),
  ('street',     'Street Photography', 'Candid stories from the streets of Pune, Talegaon and Vadgaon.',   2),
  ('cultural',   'Cultural Events',    'The pulse of Maharashtra''s traditions — Ganpati, Gudi Padwa, Diwali.', 3),
  ('events',     'Events',             'Live moments where rhythm and movement take over.',                4),
  ('landscapes', 'Landscapes',         'Quiet vistas and dramatic skies.',                                 5)
on conflict (slug) do nothing;

insert into public.subcategories (category_id, name, sort_order)
  select c.id, v.name, v.sort_order
  from public.categories c
  join (values ('Pune', 1), ('Talegaon', 2), ('Vadgaon', 3)) as v(name, sort_order) on true
  where c.slug = 'street'
on conflict (category_id, name) do nothing;

insert into public.subcategories (category_id, name, sort_order)
  select c.id, v.name, v.sort_order
  from public.categories c
  join (values ('Ganpati', 1), ('Gudi Padwa', 2), ('Diwali', 3)) as v(name, sort_order) on true
  where c.slug = 'cultural'
on conflict (category_id, name) do nothing;

insert into public.subcategories (category_id, name, sort_order)
  select c.id, v.name, v.sort_order
  from public.categories c
  join (values ('Live Dance Show', 1), ('Wrestling', 2)) as v(name, sort_order) on true
  where c.slug = 'events'
on conflict (category_id, name) do nothing;
