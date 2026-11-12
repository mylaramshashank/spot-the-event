import { NextRequest } from "next/server";
import { jsonNoStore, requireAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdminClient, isUuid, normalizeEventRow } from "@/lib/supabase/server";
import { sanitizeExternalUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["hackathon", "meetup", "workshop", "conference"]);
const ALLOWED_MODES = new Set(["in_person", "online", "hybrid"]);
const ALLOWED_STATUSES = new Set(["draft", "published", "hidden"]);

function missingAdminDbResponse() {
  return jsonNoStore(
    {
      error: "Supabase Secret Key (SUPABASE_SERVICE_ROLE_KEY) is not configured on the server.",
      configured: false,
    },
    { status: 503 }
  );
}

export async function GET(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return missingAdminDbResponse();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });

  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({
    configured: true,
    events: (data || []).map((row) => normalizeEventRow(row as Record<string, unknown>)),
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return missingAdminDbResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Invalid event payload." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim().slice(0, 200) : "";
  const rawSlug = typeof input.slug === "string" ? input.slug.trim() : "";
  const slug = rawSlug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!title || !slug) {
    return jsonNoStore({ error: "Title and valid slug are required." }, { status: 400 });
  }

  const type = typeof input.type === "string" && ALLOWED_TYPES.has(input.type) ? input.type : "hackathon";
  const mode = typeof input.mode === "string" && ALLOWED_MODES.has(input.mode) ? input.mode : "in_person";
  const status = typeof input.status === "string" && ALLOWED_STATUSES.has(input.status) ? input.status : "published";

  const startAt = new Date(String(input.start_at || ""));
  const endAt = new Date(String(input.end_at || ""));
  const deadlineAt = new Date(String(input.deadline_at || ""));
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || Number.isNaN(deadlineAt.getTime())) {
    return jsonNoStore({ error: "Valid start, end, and deadline timestamps are required." }, { status: 400 });
  }
  if (endAt < startAt) {
    return jsonNoStore({ error: "Event end time cannot be earlier than start time." }, { status: 400 });
  }

  const registerUrl = sanitizeExternalUrl(String(input.register_url || "").trim());
  if (!/^https?:\/\//i.test(registerUrl)) {
    return jsonNoStore({ error: "Registration URL must start with http:// or https://." }, { status: 400 });
  }

  const cleanOptUrl = (val: unknown): string | null => {
    if (typeof val !== "string" || !val.trim()) return null;
    const clean = sanitizeExternalUrl(val.trim());
    return clean !== "#" ? clean : null;
  };

  const reelCode = typeof input.reel_code === "string" ? input.reel_code.trim() : "";
  if (reelCode && !/^[a-zA-Z0-9_-]{1,32}$/.test(reelCode)) {
    return jsonNoStore({ error: "Invalid reel code format." }, { status: 400 });
  }

  const record = {
    slug,
    title,
    type,
    start_at: startAt.toISOString(),
    end_at: endAt.toISOString(),
    venue_name: String(input.venue_name || "Hyderabad").trim().slice(0, 300),
    venue_map_url: cleanOptUrl(input.venue_map_url),
    city: String(input.city || "Hyderabad").trim().slice(0, 80) || "Hyderabad",
    mode,
    fee_text: String(input.fee_text || "Free").trim().slice(0, 120) || "Free",
    is_free: typeof input.is_free === "boolean" ? input.is_free : true,
    eligibility: String(input.eligibility || "Open to all").trim().slice(0, 200),
    team_size: String(input.team_size || "Individual").trim().slice(0, 120),
    prize: typeof input.prize === "string" && input.prize.trim() ? input.prize.trim().slice(0, 200) : null,
    organizer: String(input.organizer || "").trim().slice(0, 160),
    register_url: registerUrl,
    deadline_at: deadlineAt.toISOString(),
    reel_url: cleanOptUrl(input.reel_url),
    reel_code: reelCode || null,
    poster_url: cleanOptUrl(input.poster_url),
    description: String(input.description || "").trim(),
    featured_note: String(input.featured_note || "").trim(),
    verified: typeof input.verified === "boolean" ? input.verified : true,
    status,
    updated_at: new Date().toISOString(),
  };

  let data: Record<string, unknown> | null = null;
  let error: { message: string } | null = null;

  if (isUuid(input.id)) {
    const res = await supabase
      .from("events")
      .update(record)
      .eq("id", input.id.trim())
      .select("*")
      .single();
    data = res.data as Record<string, unknown> | null;
    error = res.error;
  } else {
    const res = await supabase
      .from("events")
      .upsert(record, { onConflict: "slug" })
      .select("*")
      .single();
    data = res.data as Record<string, unknown> | null;
    error = res.error;
  }

  if (error || !data) {
    return jsonNoStore({ error: error?.message || "Failed to save event." }, { status: 500 });
  }

  return jsonNoStore({ event: normalizeEventRow(data) });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return missingAdminDbResponse();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim();
  const slug = searchParams.get("slug")?.trim();

  if (!id && !slug) {
    return jsonNoStore({ error: "Event id or slug is required." }, { status: 400 });
  }

  const query = isUuid(id)
    ? supabase.from("events").delete().eq("id", id)
    : supabase.from("events").delete().eq("slug", slug || id || "");

  const { error } = await query;
  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ deleted: true });
}
