create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  type text not null default 'task' check (type in ('task', 'review', 'bug', 'feature', 'research')),
  status text not null default 'incomplete' check (status in ('incomplete', 'complete')),
  assignee_id uuid references auth.users(id) on delete set null,
  reporter_id uuid references auth.users(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high', 'critical')),
  due_date date,
  estimated_hours integer not null default 0,
  parent_task_id uuid references public.tasks(id) on delete set null,
  prerequisite_mode text not null default 'all' check (prerequisite_mode in ('all')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_prerequisites (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  prerequisite_task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint task_prerequisites_unique unique (task_id, prerequisite_task_id),
  constraint task_prerequisites_no_self check (task_id <> prerequisite_task_id)
);

create table if not exists public.task_requirements (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  source_type text not null check (source_type in ('user_statement', 'design_spec')),
  content text not null,
  is_met boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_owner_id on public.projects(owner_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_assignee_status_due on public.tasks(assignee_id, status, due_date);
create index if not exists idx_tasks_parent_task_id on public.tasks(parent_task_id);
create index if not exists idx_task_prerequisites_task_id on public.task_prerequisites(task_id);
create index if not exists idx_task_prerequisites_prereq_task_id on public.task_prerequisites(prerequisite_task_id);
create index if not exists idx_task_requirements_task_id on public.task_requirements(task_id);

create trigger set_projects_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute procedure public.set_updated_at();

create trigger set_task_requirements_updated_at
before update on public.task_requirements
for each row
execute procedure public.set_updated_at();

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_prerequisites enable row level security;
alter table public.task_requirements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_authenticated_all'
  ) then
    create policy projects_authenticated_all on public.projects
      for all
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tasks' and policyname = 'tasks_authenticated_all'
  ) then
    create policy tasks_authenticated_all on public.tasks
      for all
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'task_prerequisites' and policyname = 'task_prerequisites_authenticated_all'
  ) then
    create policy task_prerequisites_authenticated_all on public.task_prerequisites
      for all
      to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'task_requirements' and policyname = 'task_requirements_authenticated_all'
  ) then
    create policy task_requirements_authenticated_all on public.task_requirements
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;