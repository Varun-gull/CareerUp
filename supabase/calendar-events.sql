create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  application_id text not null,
  company text not null,
  role text not null,
  status text not null default 'saved',
  event_type text not null default 'custom', -- 'deadline' | 'submitted' | 'custom'
  date date not null,
  created_at timestamptz default now()
);

alter table calendar_events enable row level security;

create policy "Users manage own calendar events"
  on calendar_events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index calendar_events_user_date on calendar_events (user_id, date);
