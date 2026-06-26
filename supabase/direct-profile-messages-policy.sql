alter table public.peer_messages
  alter column application_id drop not null;

grant select, insert, update on public.peer_messages to authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "Users can read leaderboard profiles" on public.profiles;
create policy "Users can read leaderboard profiles"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "Users can send peer messages" on public.peer_messages;

create policy "Users can send peer messages"
on public.peer_messages for insert
to authenticated
with check (
  auth.uid() = sender_id
  and recipient_id <> sender_id
  and (
    (
      application_id is not null
      and exists (
        select 1
        from public.applications
        where applications.id = peer_messages.application_id
          and applications.role_key = peer_messages.role_key
          and applications.user_id in (peer_messages.sender_id, peer_messages.recipient_id)
      )
    )
    or (
      application_id is null
      and role_key = concat('profile::', recipient_id::text)
      and exists (
        select 1
        from public.profiles
        where profiles.id = peer_messages.recipient_id
      )
    )
  )
);

notify pgrst, 'reload schema';
