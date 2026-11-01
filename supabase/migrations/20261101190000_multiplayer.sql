-- FishDex multiplayer. Apply after verified_fish_unlocks and verified_fish_catches.
create table if not exists public.angler_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
 display_name text not null check (char_length(display_name) between 2 and 32),
 avatar_emoji text not null default '🎣',
 created_at timestamptz not null default now()
);
create table if not exists public.angler_friend_requests (
 id bigint generated always as identity primary key,
 sender_id uuid not null references auth.users(id) on delete cascade,
 receiver_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check (status in ('pending','accepted','declined')),
 created_at timestamptz not null default now(),
 check (sender_id <> receiver_id),
 unique(sender_id,receiver_id)
);
create table if not exists public.fishing_rooms (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 3 and 50),
 invite_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
 created_at timestamptz not null default now()
);
create table if not exists public.fishing_room_members (
 room_id uuid not null references public.fishing_rooms(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 joined_at timestamptz not null default now(),
 primary key(room_id,user_id)
);
create table if not exists public.fishing_challenges (
 id uuid primary key default gen_random_uuid(),
 room_id uuid not null references public.fishing_rooms(id) on delete cascade,
 created_by uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 3 and 80),
 metric text not null check (metric in ('catches','species')),
 starts_at timestamptz not null default now(),
 ends_at timestamptz not null,
 created_at timestamptz not null default now(),
 check (ends_at > starts_at)
);
create index if not exists friend_receiver_idx on public.angler_friend_requests(receiver_id,status);
create index if not exists catches_user_date_idx on public.verified_fish_catches(user_id,verified_at);
create index if not exists room_members_user_idx on public.fishing_room_members(user_id);
alter table public.angler_profiles enable row level security;
alter table public.angler_friend_requests enable row level security;
alter table public.fishing_rooms enable row level security;
alter table public.fishing_room_members enable row level security;
alter table public.fishing_challenges enable row level security;
grant select,insert,update on public.angler_profiles to authenticated;
grant select,insert,update on public.angler_friend_requests to authenticated;
grant select,insert on public.fishing_rooms to authenticated;
grant select,insert on public.fishing_room_members to authenticated;
grant select,insert on public.fishing_challenges to authenticated;
create policy "Profiles readable by signed in anglers" on public.angler_profiles for select to authenticated using (true);
create policy "Create own profile" on public.angler_profiles for insert to authenticated with check (user_id=(select auth.uid()));
create policy "Edit own profile" on public.angler_profiles for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "See own friend requests" on public.angler_friend_requests for select to authenticated using (sender_id=(select auth.uid()) or receiver_id=(select auth.uid()));
create policy "Send own friend requests" on public.angler_friend_requests for insert to authenticated with check (sender_id=(select auth.uid()) and status='pending');
create policy "Respond to received friend requests" on public.angler_friend_requests for update to authenticated using (receiver_id=(select auth.uid()) and status='pending') with check (receiver_id=(select auth.uid()) and status in ('accepted','declined'));
-- Room data access uses SECURITY DEFINER membership functions to avoid recursive RLS.
create or replace function public.is_fishing_room_member(p_room uuid)
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.fishing_room_members where room_id=p_room and user_id=(select auth.uid()))
$$;
revoke all on function public.is_fishing_room_member(uuid) from public;
grant execute on function public.is_fishing_room_member(uuid) to authenticated;
create policy "Members see rooms" on public.fishing_rooms for select to authenticated using (owner_id=(select auth.uid()) or public.is_fishing_room_member(id));
create policy "Create owned rooms" on public.fishing_rooms for insert to authenticated with check (owner_id=(select auth.uid()));
create policy "Members see members" on public.fishing_room_members for select to authenticated using (public.is_fishing_room_member(room_id));
create policy "Owner joins own room" on public.fishing_room_members for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.fishing_rooms r where r.id=room_id and r.owner_id=(select auth.uid())));
create policy "Members see challenges" on public.fishing_challenges for select to authenticated using (public.is_fishing_room_member(room_id));
create policy "Members create challenges" on public.fishing_challenges for insert to authenticated with check (created_by=(select auth.uid()) and public.is_fishing_room_member(room_id) and ends_at <= now()+interval '90 days');
-- Join via invite code without exposing private room records.
create or replace function public.join_fishing_room(p_code text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_room uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select id into v_room from public.fishing_rooms where invite_code=upper(trim(p_code));
 if v_room is null then raise exception 'Invalid room code'; end if;
 insert into public.fishing_room_members(room_id,user_id) values(v_room,auth.uid()) on conflict do nothing;
 return v_room;
end $$;
revoke all on function public.join_fishing_room(text) from public;
grant execute on function public.join_fishing_room(text) to authenticated;
-- Leaderboard reveals only public username and aggregate scores, never private photos.
create or replace function public.fishdex_leaderboard()
returns table(user_id uuid,username text,display_name text,avatar_emoji text,species_count bigint,catch_count bigint,best_inches numeric)
language sql stable security definer set search_path=public as $$
 select p.user_id,p.username,p.display_name,p.avatar_emoji,
 (select count(*) from public.verified_fish_unlocks u where u.user_id=p.user_id),
 (select count(*) from public.verified_fish_catches c where c.user_id=p.user_id),
 (select max(c.length_inches) from public.verified_fish_catches c where c.user_id=p.user_id)
 from public.angler_profiles p
 order by 5 desc,6 desc limit 100
$$;
revoke all on function public.fishdex_leaderboard() from public;
grant execute on function public.fishdex_leaderboard() to authenticated;
-- Challenge scores are counted only from verified catches during the challenge period.
create or replace function public.fishing_challenge_scores(p_challenge uuid)
returns table(user_id uuid,username text,score bigint)
language plpgsql stable security definer set search_path=public as $$
declare ch public.fishing_challenges%rowtype;
begin
 select * into ch from public.fishing_challenges where id=p_challenge;
 if not found or not public.is_fishing_room_member(ch.room_id) then raise exception 'Not a challenge member'; end if;
 return query
 select m.user_id,coalesce(p.username,'angler')::text,
 case when ch.metric='species' then count(distinct c.species_id) else count(c.id) end::bigint
 from public.fishing_room_members m
 left join public.angler_profiles p on p.user_id=m.user_id
 left join public.verified_fish_catches c on c.user_id=m.user_id and c.verified_at>=ch.starts_at and c.verified_at<=ch.ends_at
 where m.room_id=ch.room_id
 group by m.user_id,p.username order by 3 desc;
end $$;
revoke all on function public.fishing_challenge_scores(uuid) from public;
grant execute on function public.fishing_challenge_scores(uuid) to authenticated;
