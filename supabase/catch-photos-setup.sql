-- Run once in Supabase SQL Editor before using catch photos.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('catch-photos','catch-photos',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=8388608,allowed_mime_types=excluded.allowed_mime_types;

alter table public.verified_fish_catches add column if not exists photo_path text;

-- The authenticated user may attach a photo only to their own existing verified catch.
drop policy if exists "catch owner can attach photo" on public.verified_fish_catches;
create policy "catch owner can attach photo" on public.verified_fish_catches
for update to authenticated using (user_id=auth.uid())
with check (user_id=auth.uid());

drop policy if exists "catch owner upload" on storage.objects;
create policy "catch owner upload" on storage.objects for insert to authenticated
with check (bucket_id='catch-photos' and (storage.foldername(name))[1]=auth.uid()::text
and exists(select 1 from public.verified_fish_catches c
 where c.id::text=split_part(split_part(name,'/',2),'.',1) and c.user_id=auth.uid()));

drop policy if exists "catch owner read" on storage.objects;
create policy "catch owner read" on storage.objects for select to authenticated
using (bucket_id='catch-photos' and (storage.foldername(name))[1]=auth.uid()::text);
