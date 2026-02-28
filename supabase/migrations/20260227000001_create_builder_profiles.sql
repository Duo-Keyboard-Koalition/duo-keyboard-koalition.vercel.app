-- Builder Profiles table for DKK member hub
create table if not exists public.builder_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  display_name text not null,
  bio text,
  github_url text,
  skills text[] default '{}',
  builds text[] default '{}',
  avatar_url text,
  joined_at timestamptz default now()
);

alter table public.builder_profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.builder_profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.builder_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.builder_profiles for update
  to authenticated
  using (auth.uid() = user_id);
