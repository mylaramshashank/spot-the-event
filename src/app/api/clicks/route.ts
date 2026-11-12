import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/admin-auth";
import { getSupabaseAdminClient, getSupabasePublicClient, isUuid } from "@/lib/supabase/server";

const ALLOWED_KINDS = new Set(["register", "whatsapp", "instagram", "venlix", "calendar", "share"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ ok: false }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ ok: false }, { status: 400 });
  }

  const { kind, event_id, source } = body as Record<string, unknown>;
  if (typeof kind !== "string" || !ALLOWED_KINDS.has(kind)) {
    return jsonNoStore({ ok: false }, { status: 400 });
  }

  const cleanSource = typeof source === "string" && source.trim()
    ? source.trim().slice(0, 80)
    : "web";

  const client = getSupabaseAdminClient() || getSupabasePublicClient();
  if (!client) {
    return jsonNoStore({ ok: true, persisted: false });
  }

  try {
    await client.from("click_events").insert({
      kind,
      event_id: isUuid(event_id) ? event_id.trim() : null,
      source: cleanSource,
    });
  } catch {
    // Non-blocking analytics failure
  }

  return jsonNoStore({ ok: true, persisted: true });
}
