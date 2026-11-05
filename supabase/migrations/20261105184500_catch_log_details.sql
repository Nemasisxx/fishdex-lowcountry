-- Optional catch details saved after AI verification, never used to override verified species.
alter table public.verified_fish_catches
 add column if not exists weight_lbs numeric(7,2) check (weight_lbs > 0 and weight_lbs <= 2000),
 add column if not exists catch_location text check (char_length(catch_location) <= 120),
 add column if not exists catch_method text check (catch_method in ('shore','pier','boat','kayak','surf','other'));
-- The client may edit only its own measurements and location, not verified identity or hash.
revoke update on public.verified_fish_catches from authenticated;
grant update(length_inches,weight_lbs,catch_location,catch_method) on public.verified_fish_catches to authenticated;
drop policy if exists "Update own verified catch details" on public.verified_fish_catches;
create policy "Update own verified catch details" on public.verified_fish_catches
 for update to authenticated using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);
-- Explicitly require catch ownership; this also makes it easy to enforce field validation centrally.
create or replace function public.save_verified_catch_details(
 p_catch_id bigint,p_length_inches numeric default null,p_weight_lbs numeric default null,
 p_location text default null,p_method text default null
) returns boolean language plpgsql security invoker set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if p_length_inches is not null and (p_length_inches <= 0 or p_length_inches > 300) then raise exception 'Invalid length'; end if;
 if p_weight_lbs is not null and (p_weight_lbs <= 0 or p_weight_lbs > 2000) then raise exception 'Invalid weight'; end if;
 if char_length(coalesce(p_location,'')) > 120 then raise exception 'Location too long'; end if;
 if p_method is not null and p_method not in ('shore','pier','boat','kayak','surf','other') then raise exception 'Invalid catch method'; end if;
 update public.verified_fish_catches
 set length_inches=p_length_inches,weight_lbs=p_weight_lbs,catch_location=nullif(trim(p_location),''),
 catch_method=p_method
 where id=p_catch_id and user_id=auth.uid();
 return found;
end $$;
revoke all on function public.save_verified_catch_details(bigint,numeric,numeric,text,text) from public;
grant execute on function public.save_verified_catch_details(bigint,numeric,numeric,text,text) to authenticated;
