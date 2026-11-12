import { fetchPublishedEventsServer } from "@/lib/supabase/server";
import { jsonNoStore } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await fetchPublishedEventsServer();
  return jsonNoStore({ events });
}
