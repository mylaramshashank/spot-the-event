import test, { describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { sendSuggestionNotification } from "../src/lib/email";

describe("Email Notification Service", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  test("uses console fallback when RESEND_API_KEY is not configured", async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    };

    try {
      const result = await sendSuggestionNotification({
        name: "Hyderabad AI Developers Meetup",
        url: "https://lu.ma/hyd-ai-2026",
        date_text: "28 Nov 2026",
        organizer: "Hyderabad AI Community",
        is_free: true,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.delivered, false);
      assert.ok(result.reason?.includes("RESEND_API_KEY not configured"));

      // Verify logs captured recipient and event details
      const allLogs = logs.join("\n");
      assert.ok(allLogs.includes("mylaramshashank@gmail.com"));
      assert.ok(allLogs.includes("Hyderabad AI Developers Meetup"));
      assert.ok(allLogs.includes("Free"));
    } finally {
      console.log = origLog;
    }
  });

  test("correctly includes paid status and price in notification", async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    };

    try {
      const result = await sendSuggestionNotification({
        name: "Cyberabad FullStack Hackathon",
        url: "https://unstop.com/hackathons/cyberabad",
        date_text: "15 Dec 2026",
        organizer: "CBIT Hack Club",
        college: "CBIT Gandipet",
        contact: "+91 9876543210",
        is_free: false,
        price: "₹499 per team",
      });

      assert.strictEqual(result.success, true);
      const allLogs = logs.join("\n");
      assert.ok(allLogs.includes("Paid (₹499 per team)"));
      assert.ok(allLogs.includes("₹499 per team"));
      assert.ok(allLogs.includes("CBIT Hack Club"));
      assert.ok(allLogs.includes("CBIT Gandipet"));
      assert.ok(allLogs.includes("+91 9876543210"));
    } finally {
      console.log = origLog;
    }
  });

  test("calls Resend API when RESEND_API_KEY is present", async () => {
    process.env.RESEND_API_KEY = "re_test_dummy_key_123";
    let requestedUrl = "";
    let requestedHeaders: Record<string, string> = {};
    let requestedBody: any = null;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      requestedUrl = String(url);
      requestedHeaders = (init?.headers as Record<string, string>) || {};
      requestedBody = JSON.parse(String(init?.body || "{}"));
      return new Response(JSON.stringify({ id: "msg_test_abc123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const result = await sendSuggestionNotification({
      name: "T-Hub Founders Demo Day",
      url: "https://thub.org/demoday",
      date_text: "5 Jan 2027",
      organizer: "T-Hub",
      is_free: true,
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.delivered, true);
    assert.strictEqual(result.id, "msg_test_abc123");
    assert.strictEqual(requestedUrl, "https://api.resend.com/emails");
    assert.strictEqual(requestedHeaders["Authorization"], "Bearer re_test_dummy_key_123");
    assert.deepStrictEqual(requestedBody.to, ["mylaramshashank@gmail.com"]);
    assert.ok(requestedBody.subject.includes("T-Hub Founders Demo Day"));
    assert.ok(requestedBody.html.includes("FREE EVENT"));
  });

  test("handles Resend API error gracefully without throwing", async () => {
    process.env.RESEND_API_KEY = "re_invalid_key";

    globalThis.fetch = (async () => {
      return new Response(JSON.stringify({ message: "Invalid API Key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const result = await sendSuggestionNotification({
      name: "Failing Event Notification",
      is_free: true,
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.delivered, false);
    assert.ok(result.reason?.includes("Resend API error"));
  });
});
