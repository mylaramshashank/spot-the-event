import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { ClickEventItem, ClickKind, EventItem } from "@/types";
import { SEED_EVENTS } from "@/lib/data/seed-events";
import { sanitizeExternalUrl } from "@/lib/utils";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value.trim());
}

function getSupabaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  // Normalize accidental trailing /rest/v1/ path if pasted from API docs
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function getSupabasePublicClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function normalizeEventRow(row: Record<string, unknown>): EventItem {
  const safeUrl = (val: unknown): string | undefined => {
    if (typeof val !== "string" || !val.trim()) return undefined;
    const clean = sanitizeExternalUrl(val.trim());
    return clean !== "#" ? clean : undefined;
  };

  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    type: (row.type as EventItem["type"]) || "hackathon",
    start_at: String(row.start_at || ""),
    end_at: String(row.end_at || ""),
    venue_name: String(row.venue_name || ""),
    venue_map_url: safeUrl(row.venue_map_url),
    city: String(row.city || "Hyderabad"),
    mode: (row.mode as EventItem["mode"]) || "in_person",
    fee_text: String(row.fee_text || "Free"),
    is_free: Boolean(row.is_free),
    eligibility: String(row.eligibility || "Open to all"),
    team_size: String(row.team_size || "Individual"),
    prize: typeof row.prize === "string" && row.prize.trim() ? row.prize : undefined,
    organizer: String(row.organizer || ""),
    register_url: safeUrl(row.register_url) || "#",
    deadline_at: String(row.deadline_at || ""),
    reel_url: safeUrl(row.reel_url),
    reel_code: typeof row.reel_code === "string" && row.reel_code.trim() ? row.reel_code : undefined,
    poster_url: safeUrl(row.poster_url),
    description: String(row.description || ""),
    featured_note: String(row.featured_note || ""),
    verified: Boolean(row.verified),
    status: (row.status as EventItem["status"]) || "published",
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

export async function fetchPublishedEventsServer(): Promise<EventItem[]> {
  const client = getSupabasePublicClient() || getSupabaseAdminClient();
  if (!client) return SEED_EVENTS;

  try {
    const { data, error } = await client
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("start_at", { ascending: true });

    if (error || !data) {
      return SEED_EVENTS;
    }

    return data.map((row) => normalizeEventRow(row as Record<string, unknown>));
  } catch {
    return SEED_EVENTS;
  }
}

export function computeClickAnalytics(clicks: ClickEventItem[], events: EventItem[]) {
  const byKind: Record<ClickKind, number> = {
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
      byKind[c.kind] += 1;
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
