import { EventItem, SuggestionItem, ClickEventItem, ClickKind } from "@/types";
import { SEED_EVENTS } from "./data/seed-events";
import { formatShortDate } from "./utils";

const EVENTS_STORAGE_KEY = "venlix_spot_events_v1";
const SAVED_STORAGE_KEY = "venlix_saved_events_v1";
const SUGGESTIONS_STORAGE_KEY = "venlix_suggestions_v1";
const CLICKS_STORAGE_KEY = "venlix_click_events_v1";

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // Gracefully handle Safari Private Browsing quota/security error
    console.warn(`[storage] Failed to write key "${key}" to localStorage:`, err);
  }
}

// In-memory fallback
let memoryEvents: EventItem[] = [...SEED_EVENTS];
let memorySuggestions: SuggestionItem[] = [];
let memoryClicks: ClickEventItem[] = [];

export function getEvents(): EventItem[] {
  if (typeof window === "undefined") {
    return memoryEvents;
  }
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      safeSetItem(EVENTS_STORAGE_KEY, JSON.stringify(SEED_EVENTS));
      return SEED_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return memoryEvents;
  }
}

export function getEventBySlug(slug: string): EventItem | undefined {
  const events = getEvents();
  return events.find((e) => e.slug === slug);
}

export function getEventByReelCode(code: string): EventItem | undefined {
  const events = getEvents();
  return events.find((e) => e.reel_code?.toLowerCase() === code.toLowerCase());
}

export function saveEvent(event: EventItem): void {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === event.id);
  let updated: EventItem[];
  if (index >= 0) {
    updated = [...events];
    updated[index] = { ...event, updated_at: new Date().toISOString() };
  } else {
    updated = [event, ...events];
  }
  memoryEvents = updated;
  safeSetItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
}

export function deleteEvent(id: string): void {
  const events = getEvents();
  const updated = events.filter((e) => e.id !== id);
  memoryEvents = updated;
  safeSetItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedEventIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSaveEventId(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ids = getSavedEventIds();
    let newIds: string[];
    let isSaved = false;
    if (ids.includes(id)) {
      newIds = ids.filter((item) => item !== id);
      isSaved = false;
    } else {
      newIds = [...ids, id];
      isSaved = true;
    }
    safeSetItem(SAVED_STORAGE_KEY, JSON.stringify(newIds));
    window.dispatchEvent(new Event("venlix_saved_updated"));
    return isSaved;
  } catch {
    return false;
  }
}

export function isEventSaved(id: string): boolean {
  if (typeof window === "undefined") return false;
  return getSavedEventIds().includes(id);
}

export function trackClick(kind: ClickKind, eventId?: string, source: string = "web"): void {
  const clickItem: ClickEventItem = {
    id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event_id: eventId,
    kind,
    source,
    created_at: new Date().toISOString(),
  };

  memoryClicks.push(clickItem);
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CLICKS_STORAGE_KEY);
      const existing: ClickEventItem[] = raw ? JSON.parse(raw) : [];
      safeSetItem(CLICKS_STORAGE_KEY, JSON.stringify([clickItem, ...existing]));
    } catch {
      // ignore
    }
  }
}

export function getClickAnalytics(): {
  totalClicks: number;
  byKind: Record<ClickKind, number>;
  topEvents: { id: string; title: string; clicks: number }[];
} {
  let clicks: ClickEventItem[] = memoryClicks;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CLICKS_STORAGE_KEY);
      if (raw) clicks = JSON.parse(raw);
    } catch {
      // fallback to memory
    }
  }

  const byKind: Record<ClickKind, number> = {
    register: 0,
    whatsapp: 0,
    instagram: 0,
    venlix: 0,
    calendar: 0,
    share: 0,
  };

  const eventCountMap: Record<string, number> = {};

  clicks.forEach((c) => {
    if (byKind[c.kind] !== undefined) {
      byKind[c.kind]++;
    }
    if (c.event_id && c.kind === "register") {
      eventCountMap[c.event_id] = (eventCountMap[c.event_id] || 0) + 1;
    }
  });

  const events = getEvents();
  const topEvents = Object.entries(eventCountMap)
    .map(([id, count]) => {
      const evt = events.find((e) => e.id === id);
      return {
        id,
        title: evt ? evt.title : "Unknown event",
        clicks: count,
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks: clicks.length,
    byKind,
    topEvents,
  };
}

export function submitSuggestion(data: Omit<SuggestionItem, "id" | "status" | "created_at">): void {
  const item: SuggestionItem = {
    ...data,
    id: `sug-${Date.now()}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  memorySuggestions.push(item);
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SUGGESTIONS_STORAGE_KEY);
      const existing: SuggestionItem[] = raw ? JSON.parse(raw) : [];
      safeSetItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify([item, ...existing]));
    } catch {
      // ignore
    }
  }
}

export function getSuggestions(): SuggestionItem[] {
  if (typeof window === "undefined") return memorySuggestions;
  try {
    const raw = localStorage.getItem(SUGGESTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : memorySuggestions;
  } catch {
    return memorySuggestions;
  }
}

export function updateSuggestionStatus(id: string, status: SuggestionItem["status"]): void {
  const list = getSuggestions();
  const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
  memorySuggestions = updated;
  safeSetItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(updated));
}

export function generateWeeklyDigest(events: EventItem[]): string {
  const upcoming = events.filter((e) => e.status === "published");
  const lines: string[] = [
    "Hyderabad Tech Events & Hackathons This Week",
    "Curated by @buildwithshashankk · Venlix\n",
  ];

  upcoming.slice(0, 5).forEach((evt, idx) => {
    lines.push(
      `${idx + 1}. ${evt.title.toUpperCase()}`,
      `Date: ${formatShortDate(evt.start_at)} | Venue: ${evt.venue_name}`,
      `Fee: ${evt.fee_text} | Deadline: ${formatShortDate(evt.deadline_at)}`,
      `Register: https://spot.venlix.tech/events/${evt.slug}\n`
    );
  });

  lines.push(
    "Full list & reel breakdowns on the board:",
    "https://spot.venlix.tech/events",
    "\nNo chatter. Save your weekend and build something real."
  );

  return lines.join("\n");
}
