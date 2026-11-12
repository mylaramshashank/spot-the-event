import { NextRequest, NextResponse } from "next/server";
import { sendSuggestionNotification } from "@/lib/email";
import { getSupabaseAdminClient, getSupabasePublicClient } from "@/lib/supabase/server";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MAX_TRACKED_IPS = 2000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const submissionsByIp = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp ? realIp.slice(0, 64) : "local";
}

function checkRateLimit(ip: string, now: number): { limited: boolean; retryAfterSec: number } {
  if (submissionsByIp.size > MAX_TRACKED_IPS) {
    Array.from(submissionsByIp.entries()).forEach(([key, entry]) => {
      if (now >= entry.resetAt) submissionsByIp.delete(key);
    });
  }

  const existing = submissionsByIp.get(ip);
  if (!existing || now >= existing.resetAt) {
    submissionsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfterSec: 0 };
  }

  if (existing.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { limited: false, retryAfterSec: 0 };
}

function cleanSingleLine(val: unknown, maxLen: number): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/[\r\n\0\x00-\x1F\x7F]+/g, " ")
    .trim()
    .slice(0, maxLen);
}

function validateHttpUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString().slice(0, 500);
  } catch {
    return null;
  }
}

function jsonNoStore(data: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Invalid request payload." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  // Honeypot anti-spam check
  if (typeof payload.website_hp === "string" && payload.website_hp.trim().length > 0) {
    return jsonNoStore({ success: true, message: "Suggestion received." });
  }

  const now = Date.now();
  const ip = getClientIp(req);
  const limitStatus = checkRateLimit(ip, now);
  if (limitStatus.limited) {
    const res = jsonNoStore(
      { error: "Too many submissions. Please wait a few minutes before submitting again." },
      { status: 429 }
    );
    res.headers.set("Retry-After", String(limitStatus.retryAfterSec));
    return res;
  }

  const name = cleanSingleLine(payload.name, 120);
  const organizer = cleanSingleLine(payload.organizer, 100);
  const rawUrl = cleanSingleLine(payload.url, 500);
  const is_free = typeof payload.is_free === "boolean" ? payload.is_free : true;
  const price = is_free ? "" : cleanSingleLine(payload.price, 60);
  const date_text = cleanSingleLine(payload.date_text, 100);
  const college = cleanSingleLine(payload.college, 120);
  const contact = cleanSingleLine(payload.contact, 120);

  if (name.length < 2 || organizer.length < 2) {
    return jsonNoStore(
      { error: "Event name and organizer must each be at least 2 characters." },
      { status: 400 }
    );
  }

  if (!is_free && price.length === 0) {
    return jsonNoStore(
      { error: "Please specify the ticket price or mark the event as free." },
      { status: 400 }
    );
  }

  const validUrl = validateHttpUrl(rawUrl);
  if (!validUrl) {
    return jsonNoStore(
      { error: "Please provide a valid registration URL starting with http:// or https://." },
      { status: 400 }
    );
  }

  const client = getSupabaseAdminClient() || getSupabasePublicClient();
  let savedToDb = false;
  if (client) {
    try {
      const { error } = await client.from("suggestions").insert({
        name,
        is_free,
        price: price || null,
        url: validUrl,
        date_text: date_text || "TBD",
        organizer,
        college: college || null,
        contact: contact || null,
        status: "pending",
      });
      if (!error) savedToDb = true;
    } catch {
      // Fall back to email notification
    }
  }

  const emailResult = await sendSuggestionNotification({
    name,
    is_free,
    price,
    url: validUrl,
    date_text,
    organizer,
    college,
    contact,
  });

  return jsonNoStore({
    success: true,
    savedToDb,
    delivered: emailResult.delivered,
    message: "Suggestion submitted successfully.",
  });
}
