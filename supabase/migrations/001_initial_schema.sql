-- HQ Kids - Schema Inicial

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Children profiles
create table children (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  avatar_url text,
  theme_color text not null default '#3B82F6',
  age integer not null default 10,
  parent_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text not null default 'star',
  type text not null check (type in ('casa', 'escola', 'desafio')),
  recurrence text not null check (recurrence in ('diaria', 'semanal', 'unica')),
  days_of_week integer[],
  due_date date,
  xp_reward integer not null default 10,
  coins_reward integer not null default 5,
  photo_required boolean not null default true,
  llm_criteria text,
  assigned_to uuid references children(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Task completions
create table task_completions (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  photo_url text,
  llm_response text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  completed_at timestamptz default now()
);

-- Rewards
create table rewards (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text not null default 'gift',
  cost_coins integer not null default 10,
  available_to uuid references children(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Reward redemptions
create table reward_redemptions (
  id uuid primary key default uuid_generate_v4(),
  reward_id uuid not null references rewards(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'delivered')),
  redeemed_at timestamptz default now()
);

-- Child stats
create table child_stats (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null unique references children(id) on delete cascade,
  xp_total integer not null default 0,
  coins_balance integer not null default 0,
  streak_current integer not null default 0,
  streak_max integer not null default 0,
  level integer not null default 1
);

-- RPC function to credit rewards atomically
create or replace function credit_rewards(
  p_child_id uuid,
  p_xp integer,
  p_coins integer
) returns void as $$
begin
  update child_stats
  set
    xp_total = xp_total + p_xp,
    coins_balance = coins_balance + p_coins,
    level = case
      when xp_total + p_xp >= 1500 then 6
      when xp_total + p_xp >= 1000 then 5
      when xp_total + p_xp >= 600 then 4
      when xp_total + p_xp >= 300 then 3
      when xp_total + p_xp >= 100 then 2
      else 1
    end
  where child_id = p_child_id;
end;
$$ language plpgsql security definer;

-- Row Level Security
alter table children enable row level security;
alter table tasks enable row level security;
alter table task_completions enable row level security;
alter table rewards enable row level security;
alter table reward_redemptions enable row level security;
alter table child_stats enable row level security;

-- Policies: parent can manage their own data
create policy "Parent manages children"
  on children for all
  using (parent_id = auth.uid());

create policy "Parent manages tasks"
  on tasks for all
  using (created_by = auth.uid());

create policy "Children view assigned tasks"
  on tasks for select
  using (
    created_by = auth.uid()
    or assigned_to in (select id from children where parent_id = auth.uid())
    or (assigned_to is null and created_by in (
      select parent_id from children where parent_id = auth.uid()
    ))
  );

create policy "Task completions access"
  on task_completions for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Rewards access"
  on rewards for all
  using (created_by = auth.uid());

create policy "Reward redemptions access"
  on reward_redemptions for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Child stats access"
  on child_stats for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  );

-- Storage bucket for task photos
insert into storage.buckets (id, name, public) values ('task-photos', 'task-photos', true);

create policy "Anyone can upload task photos"
  on storage.objects for insert
  with check (bucket_id = 'task-photos');

create policy "Anyone can view task photos"
  on storage.objects for select
  using (bucket_id = 'task-photos');
