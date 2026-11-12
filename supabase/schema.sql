-- Supabase PostgreSQL Schema for Spot the Event by Venlix

-- 1. Events Table
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  type text not null check (type in ('hackathon', 'meetup', 'workshop', 'conference')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  venue_name text not null,
  venue_map_url text,
  city text not null default 'Hyderabad',
  mode text not null check (mode in ('in_person', 'online', 'hybrid')),
  fee_text text not null default 'Free',
  is_free boolean not null default true,
  eligibility text not null default 'Open to all',
  team_size text not null default 'Individual',
  prize text,
  organizer text not null,
  register_url text not null check (register_url ~* '^https?://'),
  deadline_at timestamptz not null,
  reel_url text,
  reel_code text,
  poster_url text,
  description text not null,
  featured_note text not null default '',
  verified boolean not null default true,
  status text not null check (status in ('draft', 'published', 'hidden')) default 'published',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for fast slug lookups & date ordering
create index if not exists idx_events_slug on public.events (slug);
create index if not exists idx_events_status_start on public.events (status, start_at);

-- 2. Suggestions Table
create table if not exists public.suggestions (
  id uuid default gen_random_uuid() primary key,
  name text not null check (char_length(name) between 2 and 120),
  is_free boolean not null default true,
  price text check (price is null or char_length(price) <= 60),
  url text not null check (char_length(url) <= 500 and url ~* '^https?://'),
  date_text text not null check (char_length(date_text) <= 100),
  organizer text not null check (char_length(organizer) between 2 and 100),
  college text check (college is null or char_length(college) <= 120),
  contact text check (contact is null or char_length(contact) <= 120),
  status text not null check (status in ('pending', 'approved', 'rejected', 'duplicate')) default 'pending',
  created_at timestamptz default now() not null
);

-- 3. Click Analytics Table (Zero-PII outbound tracking)
create table if not exists public.click_events (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete set null,
  kind text not null check (kind in ('register', 'whatsapp', 'instagram', 'venlix', 'calendar', 'share')),
  source text not null check (char_length(source) <= 80),
  created_at timestamptz default now() not null
);

-- 4. Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.suggestions enable row level security;
alter table public.click_events enable row level security;

-- Events policies
drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events for select
using (status = 'published');

drop policy if exists "Admins have full control over events" on public.events;
create policy "Admins have full control over events"
on public.events for all
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Suggestions policies
drop policy if exists "Public can insert suggestions" on public.suggestions;
create policy "Public can insert suggestions"
on public.suggestions for insert
with check (status = 'pending');

drop policy if exists "Admins can view and manage suggestions" on public.suggestions;
create policy "Admins can view and manage suggestions"
on public.suggestions for all
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Click tracking policies
drop policy if exists "Public can log outbound clicks" on public.click_events;
create policy "Public can log outbound clicks"
on public.click_events for insert
with check (true);

drop policy if exists "Admins can view analytics" on public.click_events;
create policy "Admins can view analytics"
on public.click_events for select
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- 5. Storage Bucket for Event Posters (Public Read)
insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;
