import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "venlix_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;
const MAX_TRACKED_IPS = 2000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const failedAttemptsByIp = new Map<string, RateLimitEntry>();

function getAuthConfig(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!password || password.length < 8) return null;
  if (!secret || secret.length < 16) return null;

  return { password, secret };
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp ? realIp.slice(0, 64) : "local";
}

function pruneRateLimitMap(now: number): void {
  if (failedAttemptsByIp.size <= MAX_TRACKED_IPS) return;
  Array.from(failedAttemptsByIp.entries()).forEach(([ip, entry]) => {
    if (now >= entry.resetAt) {
      failedAttemptsByIp.delete(ip);
    }
  });
}

function isRateLimited(ip: string, now: number): { limited: boolean; retryAfterSec: number } {
  const entry = failedAttemptsByIp.get(ip);
  if (!entry) return { limited: false, retryAfterSec: 0 };
  if (now >= entry.resetAt) {
    failedAttemptsByIp.delete(ip);
    return { limited: false, retryAfterSec: 0 };
  }
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { limited: false, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string, now: number): void {
  pruneRateLimitMap(now);
  const existing = failedAttemptsByIp.get(ip);
  if (!existing || now >= existing.resetAt) {
    failedAttemptsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const digestA = crypto.createHash("sha256").update(a, "utf8").digest();
  const digestB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

function createSessionToken(password: string, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000).toString(36);
  const nonce = crypto.randomBytes(16).toString("hex");
  const pwHash = crypto.createHash("sha256").update(password, "utf8").digest("hex");
  const payload = `${issuedAt}.${nonce}.${pwHash}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${issuedAt}.${nonce}.${sig}`;
}

function verifySessionToken(token: string, password: string, secret: string): boolean {
  if (typeof token !== "string" || token.length > 256) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [issuedAtStr, nonce, providedSig] = parts;
  if (!issuedAtStr || !nonce || !providedSig) return false;

  const issuedAt = parseInt(issuedAtStr, 36);
  const nowSec = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(issuedAt) || issuedAt > nowSec + 60 || nowSec - issuedAt > SESSION_TTL_SECONDS) {
    return false;
  }

  const pwHash = crypto.createHash("sha256").update(password, "utf8").digest("hex");
  const payload = `${issuedAtStr}.${nonce}.${pwHash}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return timingSafeEqualStr(providedSig, expectedSig);
}

function jsonNoStore(data: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function GET(req: NextRequest) {
  const config = getAuthConfig();
  if (!config) {
    return jsonNoStore({ authenticated: false, configured: false });
  }

  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    return jsonNoStore({ authenticated: false, configured: true });
  }

  const valid = verifySessionToken(cookie.value, config.password, config.secret);
  return jsonNoStore({ authenticated: valid, configured: true });
}

export async function POST(req: NextRequest) {
  const config = getAuthConfig();
  if (!config) {
    return jsonNoStore(
      { error: "Admin authentication is not configured on the server." },
      { status: 503 }
    );
  }

  const now = Date.now();
  const ip = getClientIp(req);
  const limitStatus = isRateLimited(ip, now);
  if (limitStatus.limited) {
    const res = jsonNoStore(
      { error: "Too many failed login attempts. Please try again later." },
      { status: 429 }
    );
    res.headers.set("Retry-After", String(limitStatus.retryAfterSec));
    return res;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Invalid request payload." }, { status: 400 });
  }

  const { password } = body as { password?: unknown };
  if (typeof password !== "string" || password.length === 0 || password.length > 256) {
    recordFailedAttempt(ip, now);
    return jsonNoStore({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!timingSafeEqualStr(password, config.password)) {
    recordFailedAttempt(ip, now);
    return jsonNoStore({ error: "Invalid credentials." }, { status: 401 });
  }

  failedAttemptsByIp.delete(ip);

  const token = createSessionToken(config.password, config.secret);
  const res = jsonNoStore({ authenticated: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return res;
}

export async function DELETE() {
  const res = jsonNoStore({ authenticated: false });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
