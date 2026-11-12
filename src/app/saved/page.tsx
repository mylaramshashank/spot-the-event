"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { getEvents, getSavedEventIds } from "@/lib/storage";
import { EventCardRow } from "@/components/events/EventCardRow";
import { VenlixPixelLoader } from "@/components/common/VenlixLogo";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-signal-dark">
          Local bookmarks
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Saved events
        </h1>
        <p className="mt-2 text-sm text-mist">
          Stored on this device only. No account required.
        </p>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-16">
          <VenlixPixelLoader />
        </div>
      ) : savedEvents.length === 0 ? (
        <div className="mx-auto my-12 max-w-md rounded-2xl border border-line bg-paper px-8 py-10 text-center">
          <p className="font-display text-2xl font-bold text-ink">No saved events yet</p>
          <p className="mt-2 text-sm text-mist">
            Tap the bookmark on any event card to keep it handy before the deadline.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-ink px-6 text-xs font-semibold text-white"
          >
            Explore events →
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
