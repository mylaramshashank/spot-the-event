import test, { describe } from "node:test";
import assert from "node:assert";
import { submitSuggestion, getSuggestions } from "../src/lib/storage";

describe("Suggestion Storage Functionality", () => {
  test("stores free suggestion correctly", () => {
    const item = submitSuggestion({
      name: "Hyderabad JS Meetup",
      url: "https://lu.ma/hyd-js",
      date_text: "10 Dec 2026",
      organizer: "JS Community",
      is_free: true,
    });

    assert.ok(item.id.startsWith("sug-"));
    assert.strictEqual(item.name, "Hyderabad JS Meetup");
    assert.strictEqual(item.is_free, true);
    assert.strictEqual(item.price, undefined);
    assert.strictEqual(item.status, "pending");

    const all = getSuggestions();
    const found = all.find((s) => s.id === item.id);
    assert.ok(found);
    assert.strictEqual(found?.is_free, true);
  });

  test("stores paid suggestion with price correctly", () => {
    const item = submitSuggestion({
      name: "React India Workshop Hyderabad",
      url: "https://reactindia.io/workshops",
      date_text: "18 Dec 2026",
      organizer: "React India",
      is_free: false,
      price: "₹999",
    });

    assert.strictEqual(item.is_free, false);
    assert.strictEqual(item.price, "₹999");

    const all = getSuggestions();
    const found = all.find((s) => s.id === item.id);
    assert.ok(found);
    assert.strictEqual(found?.is_free, false);
    assert.strictEqual(found?.price, "₹999");
  });
});
