-- Membership and Profiles schema

-- Profiles table stores additional user information and membership flag
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  is_member boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select to authenticated
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on profiles for update to authenticated
  using (auth.uid() = id);

-- Membership payments table to log membership fee confirmations
create table if not exists membership_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null check (amount >= 0),
  code text,
  status text not null default 'success',
  created_at timestamptz default now()
);

alter table membership_payments enable row level security;

create policy "Members can insert payment records for themselves"
  on membership_payments for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Members can view their own payment records"
  on membership_payments for select to authenticated
  using (auth.uid() = user_id);

