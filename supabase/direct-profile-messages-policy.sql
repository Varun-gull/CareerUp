alter table public.peer_messages
  alter column application_id drop not null;

grant select, insert, update on public.peer_messages to authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "Users can read leaderboard profiles" on public.profiles;
create policy "Users can read leaderboard profiles"
on public.profiles for select
to authenticated
using (true);

create or replace function public.profile_exists_for_message(profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = profile_id
  );
$$;

grant execute on function public.profile_exists_for_message(uuid) to authenticated;

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
      and public.profile_exists_for_message(recipient_id)
    )
  )
);

notify pgrst, 'reload schema';

select
  'direct profile messages ready' as check_name,
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'peer_messages'
      and policyname = 'Users can send peer messages'
  ) as has_send_policy,
  exists (
    select 1
    from pg_proc
    join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
    where pg_namespace.nspname = 'public'
      and pg_proc.proname = 'profile_exists_for_message'
  ) as has_profile_helper,
  (
    select is_nullable = 'YES'
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'peer_messages'
      and column_name = 'application_id'
  ) as application_id_allows_profile_messages;
