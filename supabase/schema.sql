-- CareerUp MVP schema
-- Run this in Supabase SQL Editor after creating your project.

create extension if not exists "pgcrypto";

create type public.application_status as enum ('saved', 'applied', 'interviewing', 'offer', 'rejected');
create type public.friend_status as enum ('pending', 'accepted', 'blocked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  school text,
  school_logo_url text,
  major text,
  graduation_year text,
  target_roles text[] not null default '{}',
  target_locations text[] not null default '{}',
  resume_text text,
  resume_keywords text[] not null default '{}',
  resume_file_name text,
  resume_updated_at timestamptz,
  share_application_board boolean not null default false,
  privacy_prompt_answered boolean not null default false,
  profile_completed_awarded boolean not null default false,
  xp integer not null default 25,
  streak_count integer not null default 0,
  applications_applied integer not null default 0,
  last_applied_on date,
  streak_free_revive_used boolean not null default false,
  streak_paid_revives integer not null default 0 check (streak_paid_revives >= 0),
  streak_revive_started_on date,
  streak_revive_base_count integer,
  streak_revive_required_applications integer not null default 0,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company text not null,
  role text not null,
  location text,
  source_url text,
  status public.application_status not null default 'saved',
  role_key text,
  application_year integer not null default extract(year from now())::integer,
  fit_score integer not null default 75 check (fit_score between 0 and 100),
  xp_awarded integer not null default 0,
  deadline date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  xp_reward integer not null,
  target integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.completed_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  completed_on date not null default current_date,
  completed_at timestamptz not null default now(),
  unique (user_id, challenge_id, completed_on)
);

create table public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_id text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, reward_id)
);

create table public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  situation text not null,
  task text not null,
  action_taken text not null,
  result_outcome text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.friends (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.friend_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create table public.peer_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  role_key text not null,
  subject text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, share_application_board, privacy_prompt_answered)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'share_application_board')::boolean, false),
    coalesce((new.raw_user_meta_data ->> 'privacy_prompt_answered')::boolean, false)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger applications_set_updated_at before update on public.applications
  for each row execute procedure public.set_updated_at();

create or replace function public.normalize_role_key_part(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(trim(regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', ' ', 'g')), '\s+', ' ', 'g');
$$;

create or replace function public.build_role_key(company text, role text)
returns text
language sql
immutable
as $$
  select concat_ws('::', nullif(public.normalize_role_key_part(company), ''), nullif(public.normalize_role_key_part(role), ''));
$$;

create or replace function public.set_application_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.role_key := public.build_role_key(new.company, new.role);
  if new.application_year is null then
    new.application_year := extract(year from coalesce(new.created_at, now()))::integer;
  end if;
  return new;
end;
$$;

create trigger applications_set_search_fields
  before insert or update of company, role, created_at, application_year on public.applications
  for each row execute procedure public.set_application_search_fields();

create trigger interview_answers_set_updated_at before update on public.interview_answers
  for each row execute procedure public.set_updated_at();

create index applications_role_key_idx on public.applications(role_key);
create index applications_application_year_idx on public.applications(user_id, application_year);
create index peer_messages_sender_idx on public.peer_messages(sender_id, created_at desc);
create index peer_messages_recipient_idx on public.peer_messages(recipient_id, created_at desc);
create index peer_messages_role_key_idx on public.peer_messages(role_key);

create or replace function public.award_xp(amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set xp = xp + greatest(amount, 0),
      updated_at = now()
  where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.challenges enable row level security;
alter table public.completed_challenges enable row level security;
alter table public.user_rewards enable row level security;
alter table public.interview_answers enable row level security;
alter table public.friends enable row level security;
alter table public.peer_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select (id, full_name, school, school_logo_url, major, graduation_year, target_roles, target_locations, xp, streak_count, applications_applied, share_application_board) on public.profiles to anon;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.applications to authenticated;
grant select on public.challenges to authenticated;
grant select, insert, update, delete on public.completed_challenges to authenticated;
grant select, insert, delete on public.user_rewards to authenticated;
grant select, insert, update, delete on public.interview_answers to authenticated;
grant select, insert, update, delete on public.friends to authenticated;
grant select, insert, update on public.peer_messages to authenticated;
grant execute on function public.award_xp(integer) to authenticated;

create policy "Users can read leaderboard profiles"
on public.profiles for select
to authenticated
using (true);

create policy "Anyone can read public profile summaries"
on public.profiles for select
to anon
using (true);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Users can manage own applications"
on public.applications for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Friends can read shared application boards"
on public.applications for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = applications.user_id
      and profiles.share_application_board = true
  )
  and exists (
    select 1
    from public.friends
    where friends.status = 'accepted'
      and (
        (friends.requester_id = auth.uid() and friends.addressee_id = applications.user_id)
        or (friends.addressee_id = auth.uid() and friends.requester_id = applications.user_id)
      )
  )
);

create policy "Authenticated users can read active challenges"
on public.challenges for select
to authenticated
using (active = true);

create policy "Users can manage own completed challenges"
on public.completed_challenges for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own rewards"
on public.user_rewards for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own interview answers"
on public.interview_answers for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own friendships"
on public.friends for all
to authenticated
using (auth.uid() = requester_id or auth.uid() = addressee_id)
with check (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can read own peer messages"
on public.peer_messages for select
to authenticated
using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send peer messages"
on public.peer_messages for insert
to authenticated
with check (
  auth.uid() = sender_id
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

create policy "Recipients can mark peer messages read"
on public.peer_messages for update
to authenticated
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

create or replace function public.get_role_peer_summaries(role_keys text[])
returns table (
  role_key text,
  tracked_count integer,
  applied_count integer,
  interviewed_count integer,
  offer_count integer
)
language sql
security definer
set search_path = public
as $$
  select
    applications.role_key,
    count(*)::integer as tracked_count,
    count(*) filter (where applications.status in ('applied', 'interviewing', 'offer'))::integer as applied_count,
    count(*) filter (where applications.status in ('interviewing', 'offer'))::integer as interviewed_count,
    count(*) filter (where applications.status = 'offer')::integer as offer_count
  from public.applications
  where applications.role_key = any(role_keys)
  group by applications.role_key;
$$;

create or replace function public.get_role_peer_applicants(target_role_key text)
returns table (
  application_id uuid,
  profile_id uuid,
  full_name text,
  school text,
  school_logo_url text,
  company text,
  role text,
  location text,
  status public.application_status,
  application_year integer,
  updated_at timestamptz,
  can_message boolean
)
language sql
security definer
set search_path = public
as $$
  select
    applications.id as application_id,
    profiles.id as profile_id,
    profiles.full_name,
    profiles.school,
    profiles.school_logo_url,
    applications.company,
    applications.role,
    applications.location,
    applications.status,
    applications.application_year,
    applications.updated_at,
    (applications.user_id <> auth.uid()) as can_message
  from public.applications
  join public.profiles on profiles.id = applications.user_id
  where applications.role_key = target_role_key
    and (
      applications.user_id = auth.uid()
      or profiles.share_application_board = true
      or exists (
        select 1
        from public.friends
        where friends.status = 'accepted'
          and (
            (friends.requester_id = auth.uid() and friends.addressee_id = applications.user_id)
            or (friends.addressee_id = auth.uid() and friends.requester_id = applications.user_id)
          )
      )
    )
  order by
    case applications.status
      when 'offer' then 1
      when 'interviewing' then 2
      when 'applied' then 3
      when 'saved' then 4
      else 5
    end,
    applications.updated_at desc;
$$;

grant execute on function public.get_role_peer_summaries(text[]) to authenticated;
grant execute on function public.get_role_peer_applicants(text) to authenticated;

create or replace function public.get_peer_messages()
returns table (
  id uuid,
  role_key text,
  application_id uuid,
  sender_id uuid,
  recipient_id uuid,
  subject text,
  body text,
  read_at timestamptz,
  created_at timestamptz,
  other_profile_id uuid,
  other_full_name text,
  other_school text,
  other_school_logo_url text,
  application_company text,
  application_role text,
  application_status public.application_status,
  application_year integer
)
language sql
security definer
set search_path = public
as $$
  select
    peer_messages.id,
    peer_messages.role_key,
    peer_messages.application_id,
    peer_messages.sender_id,
    peer_messages.recipient_id,
    peer_messages.subject,
    peer_messages.body,
    peer_messages.read_at,
    peer_messages.created_at,
    other_profile.id as other_profile_id,
    other_profile.full_name as other_full_name,
    other_profile.school as other_school,
    other_profile.school_logo_url as other_school_logo_url,
    applications.company as application_company,
    applications.role as application_role,
    applications.status as application_status,
    applications.application_year
  from public.peer_messages
  left join public.applications on applications.id = peer_messages.application_id
  left join public.profiles other_profile
    on other_profile.id = case
      when peer_messages.sender_id = auth.uid() then peer_messages.recipient_id
      else peer_messages.sender_id
    end
  where auth.uid() = peer_messages.sender_id
     or auth.uid() = peer_messages.recipient_id
  order by peer_messages.created_at desc;
$$;

grant execute on function public.get_peer_messages() to authenticated;

insert into public.challenges (title, description, xp_reward, target)
values
  ('Daily Apply Sprint', 'Submit one high-quality application today.', 40, 1),
  ('Profile Polish', 'Add target roles, locations, and resume keywords.', 30, 3),
  ('Pipeline Builder', 'Save five internships that match your goals.', 60, 5)
on conflict do nothing;

-- After your own account signs up, make yourself admin:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
