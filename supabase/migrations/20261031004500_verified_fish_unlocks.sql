-- Run in Supabase SQL Editor before deploying the verify-fish Edge Function.
create table if not exists public.verified_fish_unlocks (
 user_id uuid not null references auth.users(id) on delete cascade,
 species_id integer not null check (species_id between 1 and 99),
 species_name text not null,
 verified_at timestamptz not null default now(),
 photo_sha256 text not null,
 primary key (user_id,species_id)
);
create unique index if not exists verified_fish_photo_unique on public.verified_fish_unlocks(photo_sha256);
alter table public.verified_fish_unlocks enable row level security;
revoke insert, update, delete on public.verified_fish_unlocks from anon, authenticated;
grant select on public.verified_fish_unlocks to authenticated;
drop policy if exists "Read own verified fish" on public.verified_fish_unlocks;
create policy "Read own verified fish" on public.verified_fish_unlocks for select to authenticated using ((select auth.uid()) = user_id);
