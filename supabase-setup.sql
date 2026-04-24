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

-- Custom admin users table (frontend authenticates against this — no Supabase Auth)
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  username   text unique not null,
  password   text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Row-Level Security
--   Public read for everything; writes are open to anon (the admin UI is gated
--   on the frontend by the admin_users login check). For a single-admin
--   portfolio this trade-off is acceptable.
--   admin_users is locked down to service_role only — the frontend uses an
--   RPC function to verify credentials so the password column is never exposed.
-- ---------------------------------------------------------------------------
alter table public.categories     enable row level security;
alter table public.subcategories  enable row level security;
alter table public.photos         enable row level security;
alter table public.admin_users    enable row level security;

drop policy if exists "public read categories"     on public.categories;
drop policy if exists "auth write categories"      on public.categories;
drop policy if exists "anon write categories"      on public.categories;
drop policy if exists "public read subcategories"  on public.subcategories;
drop policy if exists "auth write subcategories"   on public.subcategories;
drop policy if exists "anon write subcategories"   on public.subcategories;
drop policy if exists "public read photos"         on public.photos;
drop policy if exists "auth write photos"          on public.photos;
drop policy if exists "anon write photos"          on public.photos;

create policy "public read categories"
  on public.categories for select using (true);
create policy "anon write categories"
  on public.categories for all using (true) with check (true);

create policy "public read subcategories"
  on public.subcategories for select using (true);
create policy "anon write subcategories"
  on public.subcategories for all using (true) with check (true);

create policy "public read photos"
  on public.photos for select using (true);
create policy "anon write photos"
  on public.photos for all using (true) with check (true);

-- admin_users: NO public access. Only the verify_admin RPC (security definer)
-- can read it. This keeps passwords safe even though anon key is public.

-- ---------------------------------------------------------------------------
-- 3. Login RPC — verifies username/password without exposing the table
-- ---------------------------------------------------------------------------
create or replace function public.verify_admin(p_username text, p_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.admin_users
    where username = p_username and password = p_password
  );
end;
$$;

grant execute on function public.verify_admin(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Storage bucket for photos (public-read, anon-writable)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('photos', 'photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "public read photos bucket"  on storage.objects;
drop policy if exists "auth upload photos bucket"  on storage.objects;
drop policy if exists "auth update photos bucket"  on storage.objects;
drop policy if exists "auth delete photos bucket"  on storage.objects;
drop policy if exists "anon upload photos bucket"  on storage.objects;
drop policy if exists "anon update photos bucket"  on storage.objects;
drop policy if exists "anon delete photos bucket"  on storage.objects;

create policy "public read photos bucket"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "anon upload photos bucket"
  on storage.objects for insert
  with check (bucket_id = 'photos');

create policy "anon update photos bucket"
  on storage.objects for update
  using (bucket_id = 'photos');

create policy "anon delete photos bucket"
  on storage.objects for delete
  using (bucket_id = 'photos');

-- ---------------------------------------------------------------------------
-- 5. Seed admin user
-- ---------------------------------------------------------------------------
insert into public.admin_users (username, password) values
  ('hariom', 'hari1234')
on conflict (username) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Seed initial categories + subcategories
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

-- ---------------------------------------------------------------------------
-- 7. Tell PostgREST to reload its schema cache so new RPCs are visible
-- ---------------------------------------------------------------------------
notify pgrst, 'reload schema';
