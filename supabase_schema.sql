-- ===================================================
-- สัจจะ (Sajja) Database Schema for Supabase
-- ===================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  avatar_url text,
  sajja_score integer default 100 check (sajja_score >= 0 and sajja_score <= 100),
  total_vows_sealed integer default 0,
  current_streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. VOWS (สัจจะ) TABLE
create table if not exists public.vows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  oath_quote text not null, -- คำปฏิญาณ (ทำไมถึงอยากทำ)
  category text not null default 'ทั่วไป', -- 'สุขภาพ', 'สมาธิ', 'การเรียนรู้', 'วินัยชีวิต'
  frequency text not null default 'daily', -- 'daily', 'weekly'
  start_date date not null default current_date,
  end_date date not null,
  status text not null default 'active', -- 'active', 'completed', 'adjusted', 'archived'
  seal_color text default 'crimson', -- 'crimson', 'gold', 'emerald'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.vows enable row level security;

create policy "Users can manage their own vows" on public.vows
  for all using (auth.uid() = user_id);

-- 3. MILESTONES (หมุดหมาย) TABLE
create table if not exists public.milestones (
  id uuid default gen_random_uuid() primary key,
  vow_id uuid references public.vows(id) on delete cascade not null,
  title text not null,
  target_date date not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.milestones enable row level security;

create policy "Users can manage milestones for their vows" on public.milestones
  for all using (
    exists (
      select 1 from public.vows where vows.id = milestones.vow_id and vows.user_id = auth.uid()
    )
  );

-- 4. CHECK_INS (การเช็คอิน / บันทึกประจำวัน) TABLE
create table if not exists public.check_ins (
  id uuid default gen_random_uuid() primary key,
  vow_id uuid references public.vows(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  check_date date not null,
  status text not null check (status in ('completed', 'adjusted', 'missed')),
  note text, -- บันทึกสัจจะ (Journal reflection)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (vow_id, check_date)
);

alter table public.check_ins enable row level security;

create policy "Users can manage check-ins" on public.check_ins
  for all using (auth.uid() = user_id);

-- 5. SEALS (ตราสัจจะ) TABLE
create table if not exists public.seals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  seal_type text not null, -- 'bronze', 'silver', 'gold', 'sacred_witness', 'streak_7', 'streak_30'
  title text not null,
  description text not null,
  icon_name text default 'Award',
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.seals enable row level security;

create policy "Users can view their unlocked seals" on public.seals
  for select using (auth.uid() = user_id);

-- 6. WITNESSES (พยานสัจจะ) TABLE
create table if not exists public.witnesses (
  id uuid default gen_random_uuid() primary key,
  vow_id uuid references public.vows(id) on delete cascade not null,
  witness_email text not null,
  witness_name text,
  status text default 'pending', -- 'pending', 'accepted'
  invited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.witnesses enable row level security;

create policy "Users can manage witnesses for their vows" on public.witnesses
  for all using (
    exists (
      select 1 from public.vows where vows.id = witnesses.vow_id and vows.user_id = auth.uid()
    )
  );

-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Grant starting Bronze Seal
  insert into public.seals (user_id, seal_type, title, description, icon_name)
  values (
    new.id,
    'bronze',
    'ตราสัจจะแรกเริ่ม',
    'มอบให้แก่ผู้เปิดทางเข้าร่วมสัจจะบารมีเป็นครั้งแรก',
    'ShieldCheck'
  );

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
