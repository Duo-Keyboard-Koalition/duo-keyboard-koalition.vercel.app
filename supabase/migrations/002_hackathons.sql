create table if not exists public.hackathons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'ended')),
  start_date date,
  end_date date,
  max_team_size integer not null default 4,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.hackathon_registrations (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  team_name text,
  created_at timestamptz not null default now(),
  constraint hackathon_registrations_unique unique (hackathon_id, user_id)
);

create table if not exists public.hackathon_submissions (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  repo_url text,
  demo_url text,
  created_at timestamptz not null default now()
);

alter table public.hackathons enable row level security;
alter table public.hackathon_registrations enable row level security;
alter table public.hackathon_submissions enable row level security;

create policy "hackathons_read" on public.hackathons
  for select to authenticated using (true);

create policy "registrations_read" on public.hackathon_registrations
  for select to authenticated using (true);
create policy "registrations_insert" on public.hackathon_registrations
  for insert to authenticated with check (auth.uid() = user_id);
create policy "registrations_delete" on public.hackathon_registrations
  for delete to authenticated using (auth.uid() = user_id);

create policy "submissions_read" on public.hackathon_submissions
  for select to authenticated using (true);
create policy "submissions_insert" on public.hackathon_submissions
  for insert to authenticated with check (auth.uid() = user_id);
