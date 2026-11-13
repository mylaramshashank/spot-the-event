"use client";

import { EventItem, SuggestionItem, ClickEventItem, ClickKind } from "@/types";
import { SEED_EVENTS } from "./data/seed-events";
import { sanitizeExternalUrl } from "./utils";

const EVENTS_KEY = "venlix_spot_events_v1";
const SEED_VERSION_KEY = "venlix_spot_seed_version";
const SEED_VERSION = "2026-11-13-cmr-poster-v8";
const SAVED_KEY = "venlix_spot_saved_v1";
const SUGGESTIONS_KEY = "venlix_spot_suggestions_v1";
const CLICKS_KEY = "venlix_spot_clicks_v1";

function safeParseArray<T>(raw: string | null, validator: (item: unknown) => item is T): T[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(validator);
  } catch {
    return null;
  }
}

function isValidEventItem(item: unknown): item is EventItem {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  const e = item as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.slug === "string" &&
    typeof e.title === "string" &&
    typeof e.type === "string" &&
    typeof e.start_at === "string" &&
    typeof e.end_at === "string" &&
    typeof e.deadline_at === "string" &&
    typeof e.venue_name === "string" &&
    typeof e.register_url === "string" &&
    typeof e.status === "string"
  );
}

function isValidSuggestionItem(item: unknown): item is SuggestionItem {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  const s = item as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.name === "string" &&
    typeof s.url === "string" &&
    typeof s.status === "string" &&
    typeof s.created_at === "string"
  );
}

function isValidClickItem(item: unknown): item is ClickEventItem {
  if (!item || typeof item !== "object" || Array.isArray(item)) return false;
  const c = item as Record<string, unknown>;
  return typeof c.id === "string" && typeof c.kind === "string" && typeof c.source === "string";
}

function sanitizeEventUrls(event: EventItem): EventItem {
  return {
    ...event,
    register_url: sanitizeExternalUrl(event.register_url),
    venue_map_url: event.venue_map_url ? sanitizeExternalUrl(event.venue_map_url) : undefined,
    reel_url: event.reel_url ? sanitizeExternalUrl(event.reel_url) : undefined,
    poster_url: event.poster_url ? sanitizeExternalUrl(event.poster_url) : undefined,
  };
}

// 1. Events
export function getEvents(): EventItem[] {
  if (typeof window === "undefined") return SEED_EVENTS;
  try {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    if (storedVersion !== SEED_VERSION) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
      localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      return SEED_EVENTS;
    }
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(SEED_EVENTS));
      return SEED_EVENTS;
    }
    const parsed = safeParseArray(raw, isValidEventItem);
    if (!parsed) {
      return SEED_EVENTS;
    }
    return parsed.map(sanitizeEventUrls);
  } catch {
    return SEED_EVENTS;
  }
}

export function getEventBySlug(slug: string): EventItem | undefined {
  if (typeof slug !== "string" || !slug.trim()) return undefined;
  return getEvents().find((e) => e.slug === slug);
}

export async function fetchPublishedEvents(): Promise<EventItem[]> {
  if (typeof window === "undefined") return SEED_EVENTS;
  try {
    const res = await fetch("/api/events", { cache: "no-store" });
    if (!res.ok) return getEvents();
    const data = await res.json().catch(() => null);
    if (!data || !Array.isArray(data.events)) return getEvents();
    const valid = data.events.filter(isValidEventItem).map(sanitizeEventUrls);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(valid));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
    return valid;
  } catch {
    return getEvents();
  }
}

export function getEventByReelCode(code: string): EventItem | undefined {
  if (typeof code !== "string") return undefined;
  const clean = code.trim();
  if (!/^[a-zA-Z0-9_-]{1,32}$/.test(clean)) return undefined;
  return getEvents().find(
    (e) => e.reel_code === clean || e.reel_code === clean.padStart(2, "0")
  );
}

export function saveEvent(event: EventItem): void {
  if (typeof window === "undefined" || !isValidEventItem(event)) return;
  try {
    const sanitized = sanitizeEventUrls(event);
    const events = getEvents();
    const index = events.findIndex((e) => e.id === sanitized.id);
    if (index >= 0) {
      events[index] = { ...sanitized, updated_at: new Date().toISOString() };
    } else {
      events.unshift(sanitized);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage quota errors
  }
}

export function deleteEvent(id: string): void {
  if (typeof window === "undefined" || typeof id !== "string") return;
  try {
    const events = getEvents().filter((e) => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage errors
  }
}

// 2. Saved Events (Bookmarked by visitor)
export function getSavedEventIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = safeParseArray(raw, (v): v is string => typeof v === "string");
    return parsed || [];
  } catch {
    return [];
  }
}

export function isEventSaved(eventId: string): boolean {
  return getSavedEventIds().includes(eventId);
}

export function toggleSaveEventId(eventId: string): boolean {
  if (typeof window === "undefined" || typeof eventId !== "string") return false;
  const saved = getSavedEventIds();
  const exists = saved.includes(eventId);
  const next = exists ? saved.filter((id) => id !== eventId) : [...saved, eventId];
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("venlix_saved_updated"));
  } catch {
    // Ignore storage errors
  }
  return !exists;
}

// 3. Community Suggestions
export function getSuggestions(): SuggestionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY);
    return safeParseArray(raw, isValidSuggestionItem) || [];
  } catch {
    return [];
  }
}

export function submitSuggestion(
  data: Omit<SuggestionItem, "id" | "status" | "created_at">
): SuggestionItem {
  const newItem: SuggestionItem = {
    id: `sug-${Date.now()}`,
    name: String(data.name || "").trim().slice(0, 120),
    url: sanitizeExternalUrl(data.url) !== "#" ? sanitizeExternalUrl(data.url) : String(data.url || "").slice(0, 500),
    date_text: String(data.date_text || "").trim().slice(0, 100),
    organizer: String(data.organizer || "").trim().slice(0, 100),
    college: data.college ? String(data.college).trim().slice(0, 120) : undefined,
    contact: data.contact ? String(data.contact).trim().slice(0, 120) : undefined,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = getSuggestions();
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify([newItem, ...current].slice(0, 200)));
    } catch {
      // Ignore storage errors
    }
  }
  return newItem;
}

export function updateSuggestionStatus(
  id: string,
  status: SuggestionItem["status"]
): void {
  if (typeof window === "undefined") return;
  try {
    const list = getSuggestions().map((s) => (s.id === id ? { ...s, status } : s));
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage errors
  }
}

// 4. Lightweight Click Tracking
export function trackClick(kind: ClickKind, eventId?: string, source = "web"): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    const current = safeParseArray(raw, isValidClickItem) || [];
    const newClick: ClickEventItem = {
      id: `clk-${Date.now()}`,
      event_id: eventId,
      kind,
      source: String(source).slice(0, 80),
      created_at: new Date().toISOString(),
    };
    const next = [newClick, ...current].slice(0, 500);
    localStorage.setItem(CLICKS_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota errors
  }

  try {
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        event_id: eventId,
        source: String(source).slice(0, 80),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Non-blocking analytics failure
  }
}

export function getClickStats(): ClickEventItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    return safeParseArray(raw, isValidClickItem) || [];
  } catch {
    return [];
  }
}

export function getClickAnalytics() {
  const clicks = getClickStats();
  const events = getEvents();
  const byKind = {
    register: 0,
    whatsapp: 0,
    instagram: 0,
    venlix: 0,
    calendar: 0,
    share: 0,
  };
  const clicksByEventId: Record<string, number> = {};

  clicks.forEach((c) => {
    if (c.kind in byKind) {
      byKind[c.kind as ClickKind] += 1;
    }
    if (c.kind === "register" && c.event_id) {
      clicksByEventId[c.event_id] = (clicksByEventId[c.event_id] || 0) + 1;
    }
  });

  const topEvents = Object.entries(clicksByEventId)
    .map(([id, count]) => ({
      id,
      title: events.find((e) => e.id === id)?.title || id,
      clicks: count,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  return {
    totalClicks: clicks.length,
    byKind,
    topEvents,
    recent: clicks.slice(0, 15),
  };
}

// 5. WhatsApp Weekly Digest Generator
export function generateWeeklyDigest(events: EventItem[]): string {
  const upcoming = events
    .filter((e) => e.status === "published")
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 5);

  let text = `*Spot the Event · This Week's Hyderabad Lineup*\n`;
  text += `_Curated by @buildwithshashankk · Built by Venlix_\n\n`;

  upcoming.forEach((e, idx) => {
    const dateStr = new Date(e.start_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      weekday: "short",
      timeZone: "Asia/Kolkata",
    });
    text += `*${idx + 1}. ${e.title}*\n`;
    text += `Date: ${dateStr} | Venue: ${e.venue_name.split(",")[0]}\n`;
    text += `Entry: ${e.fee_text}${e.prize ? ` | Prize: ${e.prize}` : ""}\n`;
    text += `Details & Link: https://spot-the-event.vercel.app/events/${e.slug}\n\n`;
  });

  text += `Explore all events: https://spot-the-event.vercel.app/events\n`;
  text += `Forward this message to your college dev groups!`;

  return text;
}
