import test, { describe } from "node:test";
import assert from "node:assert";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/suggest/route";

describe("POST /api/suggest Route Handler", () => {
  test("processes valid free event suggestion and triggers notification", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hyderabad Rustacean Meetup",
        url: "https://meetup.com/hyderabad-rust",
        date_text: "12 Dec 2026",
        organizer: "Rust Hyd Group",
        is_free: true,
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(typeof json.delivered, "boolean");
  });

  test("processes valid paid event suggestion with price", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Agentic AI Bootcamp Hyderabad",
        url: "https://lu.ma/hyd-agentic-bootcamp",
        date_text: "20 Dec 2026",
        organizer: "AI Guild",
        is_free: false,
        price: "₹1,499 per developer",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  test("returns 400 when event name is missing or empty", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "   ",
        url: "https://example.com",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);

    const json = await res.json();
    assert.ok(json.error?.includes("Event name is required"));
  });

  test("silently accepts bot honeypot submission without error", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Spam Bot Event",
        website_hp: "http://spam.ru",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  test("returns 400 when paid event has no price specified", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Paid Conference Without Price",
        is_free: false,
        price: "   ",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);

    const json = await res.json();
    assert.ok(json.error?.includes("Price or registration fee is required"));
  });

  test("handles string is_free: 'false' correctly requiring price", async () => {
    const req = new NextRequest("http://localhost/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Tech Summit Hyderabad",
        is_free: "false",
        price: "₹799",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
  });
});
