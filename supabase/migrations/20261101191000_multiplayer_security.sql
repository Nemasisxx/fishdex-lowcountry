-- Restrict friend-request edits to status only; identity fields must be immutable.
revoke update on public.angler_friend_requests from authenticated;
grant update(status) on public.angler_friend_requests to authenticated;
-- Prevent arbitrary public profile avatar strings from being used as excessively large data.
alter table public.angler_profiles add constraint angler_avatar_length check (char_length(avatar_emoji) <= 12);
-- Keep room member lookup scoped to authenticated users.
revoke execute on function public.is_fishing_room_member(uuid) from anon;
