-- Supabase Schema for Spot the Event by Venlix
-- Hyderabad tech events, hackathons, meetups and workshops

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: events
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  type text not null check (type in ('hackathon', 'meetup', 'workshop', 'conference')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  venue_name text not null,
  venue_map_url text,
  city text default 'Hyderabad',
  mode text not null check (mode in ('in_person', 'online', 'hybrid')),
  fee_text text not null default 'Free',
  is_free boolean not null default true,
  eligibility text default 'Open to all college students',
  team_size text default '1 - 4 members',
  prize text,
  organizer text not null,
  register_url text not null,
  deadline_at timestamptz not null,
  reel_url text,
  reel_code text unique,
  poster_url text,
  description text not null,
  featured_note text,
  verified boolean not null default true,
  status text not null default 'published' check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: suggestions
create table if not exists public.suggestions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  url text not null,
  date_text text not null,
  organizer text not null,
  college text,
  contact text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'duplicate')),
  created_at timestamptz not null default now()
);

-- Table: click_events
create table if not exists public.click_events (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete set null,
  kind text not null check (kind in ('register', 'whatsapp', 'instagram', 'venlix', 'calendar', 'share')),
  source text default 'web',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.suggestions enable row level security;
alter table public.click_events enable row level security;

-- Policies for events:
-- Public can read only published events
create policy "Allow public read published events"
  on public.events for select
  using (status = 'published');

-- Admins can do all on events (verified by app_metadata role)
create policy "Allow authenticated admins full access to events"
  on public.events for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Policies for suggestions:
-- Anyone can insert a suggestion (review queue)
create policy "Allow public insert suggestions"
  on public.suggestions for insert
  with check (true);

-- Only admins can read or update suggestions
create policy "Allow authenticated admins full access to suggestions"
  on public.suggestions for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Policies for click_events:
-- Public can insert click analytics
create policy "Allow public insert click events"
  on public.click_events for insert
  with check (true);

-- Only authenticated admins can read click events
create policy "Allow authenticated admins read click events"
  on public.click_events for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Indexes for performance
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_start_at on public.events(start_at);
create index if not exists idx_events_type on public.events(type);
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_reel_code on public.events(reel_code);
create index if not exists idx_click_events_kind on public.click_events(kind);
