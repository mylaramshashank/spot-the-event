import test, { describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("Suggest Form Inputs and Submission State Verification", () => {
  const suggestPagePath = path.resolve(process.cwd(), "src/app/suggest/page.tsx");
  const inlineSuggestPath = path.resolve(process.cwd(), "src/components/home/SuggestSection.tsx");

  test("suggest/page.tsx has interactive free/paid toggles and price field", () => {
    const content = fs.readFileSync(suggestPagePath, "utf8");

    // State definitions
    assert.ok(content.includes("is_free: true"), "Form state must default to is_free: true");
    assert.ok(content.includes('price: ""'), "Form state must initialize price");

    // Interactive button controls for free vs paid
    assert.ok(content.includes("Free Event"), "Form must render Free Event toggle option");
    assert.ok(content.includes("Paid Event"), "Form must render Paid Event toggle option");

    // Conditional rendering of price input
    assert.ok(content.includes("!formData.is_free &&"), "Price input must conditionally render when event is paid");
    assert.ok(content.includes("Ticket Price / Registration Fee"), "Must have label for price input");

    // Validation for paid event price
    assert.ok(
      content.includes("!formData.is_free && !formData.price.trim()"),
      "Must validate that price is provided when paid event is selected"
    );

    // Payload formulation
    assert.ok(
      content.includes("price: formData.is_free ? undefined : formData.price.trim()"),
      "Must clear or omit price when event is marked as free"
    );

    // Submission triggers POST /api/suggest
    assert.ok(content.includes('fetch("/api/suggest"'), "Must POST to /api/suggest endpoint");
  });

  test("SuggestSection.tsx has interactive free/paid controls and price field", () => {
    const content = fs.readFileSync(inlineSuggestPath, "utf8");

    // State definitions
    assert.ok(content.includes("useState(true)"), "Inline state must track isFree");
    assert.ok(content.includes('useState("")'), "Inline state must track price");

    // Toggle options
    assert.ok(content.includes(">Free<"), "Inline section must render Free toggle option");
    assert.ok(content.includes(">Paid<"), "Inline section must render Paid toggle option");

    // Conditional price input
    assert.ok(content.includes("!isFree &&"), "Inline section must render price input when paid");
    assert.ok(content.includes("price.trim()"), "Inline section must validate price input");

    // Clearing price when switching back to free
    assert.ok(content.includes('setPrice("")'), "Must reset price when switched back to free");

    // Submission triggers POST /api/suggest
    assert.ok(content.includes('fetch("/api/suggest"'), "Inline form must trigger /api/suggest");
  });

  test("simulates suggest form payload logic for Free vs Paid states", () => {
    // Helper replicating the state machine logic from SuggestPage & SuggestSection
    function buildSubmissionPayload(input: {
      name: string;
      url: string;
      date_text: string;
      organizer: string;
      is_free: boolean;
      price: string;
      honeypot?: string;
    }) {
      if (input.honeypot) {
        return { dropped: true, error: null, payload: null };
      }
      if (!input.name.trim()) {
        return { dropped: false, error: "Event name is required", payload: null };
      }
      if (!input.is_free && !input.price.trim()) {
        return { dropped: false, error: "Price is required for paid events", payload: null };
      }

      return {
        dropped: false,
        error: null,
        payload: {
          name: input.name.trim(),
          url: input.url.trim() || "N/A",
          date_text: input.date_text.trim() || "TBD",
          organizer: input.organizer.trim() || "Community suggestion",
          is_free: input.is_free,
          price: input.is_free ? undefined : input.price.trim(),
        },
      };
    }

    // 1. Free event
    const freeResult = buildSubmissionPayload({
      name: "Hyderabad Rustacean Meetup",
      url: "https://meetup.com/rust",
      date_text: "12 Dec 2026",
      organizer: "Rust Hyd",
      is_free: true,
      price: "ignored-price-for-free",
    });
    assert.strictEqual(freeResult.error, null);
    assert.strictEqual(freeResult.payload?.is_free, true);
    assert.strictEqual(freeResult.payload?.price, undefined);

    // 2. Paid event with price
    const paidResult = buildSubmissionPayload({
      name: "Agentic AI Bootcamp",
      url: "https://lu.ma/bootcamp",
      date_text: "20 Dec 2026",
      organizer: "AI Guild",
      is_free: false,
      price: "₹1,499 per developer",
    });
    assert.strictEqual(paidResult.error, null);
    assert.strictEqual(paidResult.payload?.is_free, false);
    assert.strictEqual(paidResult.payload?.price, "₹1,499 per developer");

    // 3. Paid event without price -> error
    const missingPriceResult = buildSubmissionPayload({
      name: "Paid Workshop",
      url: "https://example.com",
      date_text: "Tomorrow",
      organizer: "Dev Org",
      is_free: false,
      price: "   ",
    });
    assert.strictEqual(missingPriceResult.payload, null);
    assert.ok(missingPriceResult.error?.includes("Price is required for paid events"));

    // 4. Honeypot filled -> dropped
    const botResult = buildSubmissionPayload({
      name: "Spam Event",
      url: "http://spam.org",
      date_text: "Now",
      organizer: "Bot",
      is_free: true,
      price: "",
      honeypot: "http://bot-site.com",
    });
    assert.strictEqual(botResult.dropped, true);
    assert.strictEqual(botResult.payload, null);
  });
});
