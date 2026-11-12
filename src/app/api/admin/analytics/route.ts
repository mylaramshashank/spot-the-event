import { NextRequest } from "next/server";
import { jsonNoStore, requireAdminSession } from "@/lib/admin-auth";
import { computeClickAnalytics, getSupabaseAdminClient, normalizeEventRow } from "@/lib/supabase/server";
import { ClickEventItem } from "@/types";

export const dynamic = "force-dynamic";

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

  const [clicksRes, eventsRes] = await Promise.all([
    supabase.from("click_events").select("*").order("created_at", { ascending: false }).limit(2000),
    supabase.from("events").select("*"),
  ]);

  if (clicksRes.error) {
    return jsonNoStore({ error: clicksRes.error.message }, { status: 500 });
  }

  const clicks = (clicksRes.data || []) as ClickEventItem[];
  const events = (eventsRes.data || []).map((row) => normalizeEventRow(row as Record<string, unknown>));

  return jsonNoStore({
    configured: true,
    analytics: computeClickAnalytics(clicks, events),
  });
}
