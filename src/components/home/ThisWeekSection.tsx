"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { EventCardRow } from "../events/EventCardRow";
import { getEventStatus } from "@/lib/utils";

interface ThisWeekSectionProps {
  events: EventItem[];
}

export function ThisWeekSection({ events }: ThisWeekSectionProps) {
  // Only display events whose registrations are currently OPEN (auto-removes closed events)
  const openEvents = events.filter(
    (e) => e.status === "published" && getEventStatus(e) !== "ended"
  );
  const featured = openEvents.slice(0, 6);

  if (openEvents.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
            01 / THIS WEEK
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 tracking-tight">
            Upcoming on the board
          </h2>
        </div>
        <Link
          href="/events"
          className="text-xs sm:text-sm font-sans font-semibold text-navy-900 hover:text-emerald transition-colors underline underline-offset-4"
        >
          See all ({events.length}) &rarr;
        </Link>
      </div>

      <div className="space-y-3">
        {featured.map((evt) => (
          <EventCardRow key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  );
}
