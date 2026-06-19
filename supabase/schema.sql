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
  major text,
  graduation_year text,
  target_roles text[] not null default '{}',
  target_locations text[] not null default '{}',
  resume_text text,
  resume_keywords text[] not null default '{}',
  resume_file_name text,
  resume_updated_at timestamptz,
  profile_completed_awarded boolean not null default false,
  xp integer not null default 25,
  streak_count integer not null default 0,
  applications_applied integer not null default 0,
  last_applied_on date,
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
  completed_at timestamptz not null default now(),
  unique (user_id, challenge_id)
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
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

create trigger interview_answers_set_updated_at before update on public.interview_answers
  for each row execute procedure public.set_updated_at();

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

grant usage on schema public to anon, authenticated;
grant select (id, full_name, school, major, graduation_year, target_roles, target_locations, xp, streak_count, applications_applied) on public.profiles to anon;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.applications to authenticated;
grant select on public.challenges to authenticated;
grant select, insert, update, delete on public.completed_challenges to authenticated;
grant select, insert, delete on public.user_rewards to authenticated;
grant select, insert, update, delete on public.interview_answers to authenticated;
grant select, insert, update, delete on public.friends to authenticated;
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

insert into public.challenges (title, description, xp_reward, target)
values
  ('Daily Apply Sprint', 'Submit one high-quality application today.', 40, 1),
  ('Profile Polish', 'Add target roles, locations, and resume keywords.', 30, 3),
  ('Pipeline Builder', 'Save five internships that match your goals.', 60, 5)
on conflict do nothing;

-- After your own account signs up, make yourself admin:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
