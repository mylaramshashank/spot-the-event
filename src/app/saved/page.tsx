"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { getEvents, getSavedEventIds } from "@/lib/storage";
import { EventCardRow } from "@/components/events/EventCardRow";

export default function SavedPage() {
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const all = getEvents();
      const ids = getSavedEventIds();
      setSavedEvents(all.filter((e) => ids.includes(e.id)));
      setLoaded(true);
    };

    refresh();
    window.addEventListener("venlix_saved_updated", refresh);
    return () => window.removeEventListener("venlix_saved_updated", refresh);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
          LOCAL BOOKMARKS
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
          Saved Events
        </h1>
        <p className="mt-2 text-sm text-slate">
          Events bookmarked directly on this device. No account or login required.
        </p>
      </div>

      {loaded && savedEvents.length === 0 ? (
        <div className="my-12 p-8 bg-paper border border-rule rounded-3xl text-center max-w-md mx-auto shadow-sm">
          <p className="text-2xl font-bold text-navy-900 mb-2">
            No saved events yet
          </p>
          <p className="text-sm text-slate mb-6">
            Tap the bookmark icon on any event card to keep it handy for quick registration before the deadline.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-navy-900 text-offwhite font-semibold text-xs tracking-wide hover:bg-navy-800 transition-colors shadow-xs"
          >
            Explore upcoming events &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedEvents.map((evt) => (
            <EventCardRow key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
