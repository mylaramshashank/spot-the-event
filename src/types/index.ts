export type EventType = 'hackathon' | 'meetup' | 'workshop' | 'conference';
export type EventMode = 'in_person' | 'online' | 'hybrid';
export type EventStatus = 'draft' | 'published' | 'hidden';

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  start_at: string; // ISO date string
  end_at: string;
  venue_name: string;
  venue_map_url?: string;
  city: string;
  mode: EventMode;
  fee_text: string;
  is_free: boolean;
  eligibility: string;
  team_size: string;
  prize?: string;
  organizer: string;
  register_url: string;
  deadline_at: string;
  reel_url?: string;
  reel_code?: string; // e.g. "42" for /r/42
  poster_url?: string;
  description: string;
  featured_note: string; // "Why I featured this" - Shashank's editorial voice
  verified: boolean;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface SuggestionItem {
  id: string;
  name: string;
  url: string;
  date_text: string;
  organizer: string;
  college?: string;
  contact?: string;
  is_free?: boolean;
  price?: string;
  status: 'pending' | 'approved' | 'rejected' | 'duplicate';
  created_at: string;
}

export type ClickKind = 'register' | 'whatsapp' | 'instagram' | 'venlix' | 'calendar' | 'share';

export interface ClickEventItem {
  id: string;
  event_id?: string;
  kind: ClickKind;
  source: string;
  created_at: string;
}

export interface FilterOptions {
  type: 'all' | EventType;
  when: 'all' | 'today' | 'this_week' | 'this_month';
  cost: 'all' | 'free' | 'paid';
  mode: 'all' | 'in_person' | 'online';
  onlyOpen: boolean;
  searchQuery: string;
  sortBy: 'soonest' | 'closing_soon' | 'recently_added';
}
