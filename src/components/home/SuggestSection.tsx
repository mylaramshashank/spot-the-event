"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitSuggestion } from "@/lib/storage";

export function SuggestSection() {
  const [eventName, setEventName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Silent drop if bot filled honeypot
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    if (!eventName.trim()) return;

    submitSuggestion({
      name: eventName.trim().slice(0, 120),
      url: "Quick inline submission",
      date_text: "TBD",
      organizer: "Community suggestion",
    });

    setSubmitted(true);
    setEventName("");
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="max-w-xl">
        <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
          06 / SUGGEST AN EVENT
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 tracking-tight">
          Know an event that deserves the reel?
        </h2>
        <p className="mt-3 text-sm font-sans text-slate leading-relaxed">
          Tell us the name of the upcoming hackathon, college fest, or meetup in Hyderabad. If it fits our editorial standards, it will be in the next reel.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 bg-emerald-100 border border-emerald/30 rounded-sm text-sm font-sans text-navy-900">
            Got it. If it fits, it will be in the next reel.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. JNTUH HackQuest 2026"
              required
              className="flex-1 h-12 px-5 bg-paper border border-rule text-navy-900 placeholder:text-slate-500/60 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald shadow-xs"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-navy-900 text-offwhite text-sm font-semibold rounded-full hover:bg-navy-800 active:scale-95 transition-all shrink-0 shadow-xs"
            >
              Submit idea
            </button>
          </form>
        )}

        <div className="mt-3">
          <Link
            href="/suggest"
            className="text-xs font-sans font-medium text-slate hover:text-navy-900 underline underline-offset-4"
          >
            Or fill out the full details with links &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
