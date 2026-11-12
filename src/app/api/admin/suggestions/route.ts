import { NextRequest } from "next/server";
import { jsonNoStore, requireAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdminClient, isUuid } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED_SUGGESTION_STATUSES = new Set(["pending", "approved", "rejected", "duplicate"]);

export async function GET(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return jsonNoStore(
      { error: "Supabase Secret Key (SUPABASE_SERVICE_ROLE_KEY) is not configured on the server.", configured: false },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ configured: true, suggestions: data || [] });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return jsonNoStore(
      { error: "Supabase Secret Key (SUPABASE_SERVICE_ROLE_KEY) is not configured on the server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Invalid payload." }, { status: 400 });
  }

  const { id, status } = body as Record<string, unknown>;
  if (!isUuid(id) || typeof status !== "string" || !ALLOWED_SUGGESTION_STATUSES.has(status)) {
    return jsonNoStore({ error: "Valid suggestion id and status are required." }, { status: 400 });
  }

  const { error } = await supabase.from("suggestions").update({ status }).eq("id", id);
  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
