-- WARAKA catalogue MVP: practitioners and products.
-- Run this script in Supabase SQL Editor before adding live records.

create extension if not exists pgcrypto;

create table if not exists public.practitioners (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  slug text unique not null,
  name text not null,
  specialty text not null default 'Pratique traditionnelle déclarée',
  city text not null default '',
  region text not null default '',
  bio text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  publication_status text not null default 'pending_review'
    check (publication_status in ('draft', 'pending_review', 'published', 'rejected')),
  verification_status text not null default 'not_reviewed'
    check (verification_status in ('not_reviewed', 'in_review', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid references public.practitioners(id) on delete set null,
  slug text unique not null,
  name text not null,
  category text not null default 'autre'
    check (category in ('preparation', 'huile', 'plante', 'autre')),
  description text not null default '',
  details text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  status text not null default 'pending_review'
    check (status in ('draft', 'pending_review', 'approved', 'rejected')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_public_catalog_idx
  on public.products (is_featured desc, created_at desc)
  where status = 'approved';
create index if not exists products_practitioner_idx
  on public.products (practitioner_id);
create index if not exists practitioners_public_directory_idx
  on public.practitioners (name)
  where publication_status = 'published';

alter table public.practitioners enable row level security;
alter table public.products enable row level security;

-- Expose read access only; product/practitioner submissions and approvals are
-- managed by the WARAKA team in Supabase for this first MVP.
revoke all on public.practitioners from anon, authenticated;
revoke all on public.products from anon, authenticated;
grant select on public.practitioners to anon, authenticated;
grant select on public.products to anon, authenticated;

drop policy if exists "Anyone can read published practitioners" on public.practitioners;
create policy "Anyone can read published practitioners"
  on public.practitioners for select to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "Anyone can read approved products" on public.products;
create policy "Anyone can read approved products"
  on public.products for select to anon, authenticated
  using (
    status = 'approved'
    and (
      practitioner_id is null
      or exists (
        select 1
        from public.practitioners p
        where p.id = products.practitioner_id
          and p.publication_status = 'published'
      )
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists practitioners_set_updated_at on public.practitioners;
create trigger practitioners_set_updated_at
  before update on public.practitioners
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
