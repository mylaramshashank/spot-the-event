"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitSuggestion } from "@/lib/storage";

export function SuggestSection() {
  const [eventName, setEventName] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    if (!eventName.trim()) return;
    if (!isFree && !price.trim()) {
      setError("Please specify the ticket price for this paid event.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: eventName.trim().slice(0, 120),
      url: "Quick inline submission",
      date_text: "TBD",
      organizer: "Community suggestion",
      is_free: isFree,
      price: isFree ? undefined : price.trim(),
    };
    submitSuggestion(payload);

    try {
      await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // local queue still saved
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setEventName("");
      setPrice("");
    }
  };

  return (
    <section className="border-t border-line px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
          Suggest an event
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Know something that deserves the reel?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Drop the name of a Hyderabad hackathon, fest, or meetup. If it fits the bar, it lands in the next reel.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-signal/30 bg-signal-soft px-4 py-4 text-sm text-ink">
            Got it. If it fits, it will be in the next reel.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {error && (
              <div className="rounded-md border border-alert/30 bg-alert/10 px-3 py-2 text-xs font-medium text-alert">
                {error}
              </div>
            )}
            <div className="hidden" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. JNTUH HackQuest 2026"
                required
                className="h-12 flex-1 rounded-md border border-line bg-paper px-4 text-sm text-ink placeholder:text-mist-soft focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 shrink-0 rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-70"
              >
                {submitting ? "Submitting…" : "Submit idea"}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-mist">Cost</span>
              <button
                type="button"
                onClick={() => { setIsFree(true); setPrice(""); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${isFree ? "bg-ink text-white" : "border border-line text-mist"}`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${!isFree ? "bg-ink text-white" : "border border-line text-mist"}`}
              >
                Paid
              </button>
              {!isFree && (
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price (e.g. ₹299)"
                  required={!isFree}
                  className="h-9 min-w-[160px] flex-1 rounded-md border border-line bg-paper px-3 text-xs"
                />
              )}
            </div>
          </form>
        )}

        <Link href="/suggest" className="mt-4 inline-flex text-xs font-medium text-mist underline-offset-4 hover:text-ink hover:underline">
          Or fill the full form with links →
        </Link>
      </div>
    </section>
  );
}
