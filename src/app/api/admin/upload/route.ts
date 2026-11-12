import { NextRequest } from "next/server";
import { jsonNoStore, requireAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  const denied = requireAdminSession(req);
  if (denied) return denied;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return jsonNoStore(
      { error: "Supabase Secret Key (SUPABASE_SERVICE_ROLE_KEY) is not configured on the server." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonNoStore({ error: "Invalid multipart form upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return jsonNoStore({ error: "Poster image file is required." }, { status: 400 });
  }

  const ext = ALLOWED_MIME_EXT[file.type.toLowerCase()];
  if (!ext) {
    return jsonNoStore({ error: "Only JPG, PNG, and WebP images are supported." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return jsonNoStore({ error: "Image must be under 5 MB." }, { status: 400 });
  }

  const baseName = (file.name || "poster")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "poster";

  const objectPath = `${Date.now()}-${baseName}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("posters")
    .upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("posters").getPublicUrl(objectPath);
  return jsonNoStore({ url: data.publicUrl });
}
