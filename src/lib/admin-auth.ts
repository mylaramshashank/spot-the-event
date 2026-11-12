import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "venlix_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export function getAuthConfig(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!password || password.length < 8) return null;
  if (!secret || secret.length < 16) return null;

  return { password, secret };
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  const digestA = crypto.createHash("sha256").update(a, "utf8").digest();
  const digestB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

export function createSessionToken(password: string, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000).toString(36);
  const nonce = crypto.randomBytes(16).toString("hex");
  const pwHash = crypto.createHash("sha256").update(password, "utf8").digest("hex");
  const payload = `${issuedAt}.${nonce}.${pwHash}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${issuedAt}.${nonce}.${sig}`;
}

export function verifySessionToken(token: string, password: string, secret: string): boolean {
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

export function jsonNoStore(data: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("CDN-Cache-Control", "no-store");
  res.headers.set("Vercel-CDN-Cache-Control", "no-store");
  res.headers.set("Pragma", "no-cache");
  return res;
}

export function isAdminRequestAuthenticated(req: NextRequest): { authenticated: boolean; configured: boolean } {
  const config = getAuthConfig();
  if (!config) {
    return { authenticated: false, configured: false };
  }
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    return { authenticated: false, configured: true };
  }
  return {
    authenticated: verifySessionToken(cookie.value, config.password, config.secret),
    configured: true,
  };
}

export function requireAdminSession(req: NextRequest): NextResponse | null {
  const { authenticated, configured } = isAdminRequestAuthenticated(req);
  if (!configured) {
    return jsonNoStore(
      { error: "Admin authentication is not configured on the server." },
      { status: 503 }
    );
  }
  if (!authenticated) {
    return jsonNoStore({ error: "Unauthorized. Please log in to /admin." }, { status: 401 });
  }
  return null;
}
