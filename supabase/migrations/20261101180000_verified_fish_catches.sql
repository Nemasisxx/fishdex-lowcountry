-- Each successfully verified new photograph is a catch; species unlock remains one per user/species.
create table if not exists public.verified_fish_catches (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 species_id integer not null check (species_id between 1 and 99),
 species_name text not null,
 photo_sha256 text not null unique,
 length_inches numeric(6,2) check (length_inches > 0 and length_inches <= 300),
 verified_at timestamptz not null default now()
);
create index if not exists verified_fish_catches_user_species_idx on public.verified_fish_catches(user_id,species_id,verified_at desc);
alter table public.verified_fish_catches enable row level security;
revoke insert, update, delete on public.verified_fish_catches from anon, authenticated;
grant select on public.verified_fish_catches to authenticated;
drop policy if exists "Read own verified catches" on public.verified_fish_catches;
create policy "Read own verified catches" on public.verified_fish_catches for select to authenticated using ((select auth.uid()) = user_id);
-- Existing one-time unlocks are not automatically treated as multiple catches.
-- Optional backfill gives existing unlocked species one historical catch.
insert into public.verified_fish_catches(user_id,species_id,species_name,photo_sha256,verified_at)
select user_id,species_id,species_name,photo_sha256,verified_at
from public.verified_fish_unlocks
on conflict (photo_sha256) do nothing;
