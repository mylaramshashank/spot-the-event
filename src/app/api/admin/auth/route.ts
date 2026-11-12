import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "venlix_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "venlix-secret-salt-2026";

function getExpectedToken(): string {
  const masterPassword = process.env.ADMIN_PASSWORD || "venlix-spot-admin";
  return crypto.createHmac("sha256", SESSION_SECRET).update(masterPassword).digest("hex");
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const expectedToken = getExpectedToken();
  if (cookie.value === expectedToken) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const masterPassword = process.env.ADMIN_PASSWORD || "venlix-spot-admin";

    const isMatch = password === masterPassword;

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = getExpectedToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
