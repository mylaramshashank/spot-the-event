"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { EventCardRow } from "../events/EventCardRow";
import { VenlixPixelLoader } from "../common/VenlixLogo";

interface ThisWeekSectionProps {
  events: EventItem[];
  loading?: boolean;
}

export function ThisWeekSection({ events, loading }: ThisWeekSectionProps) {
  const featured = events.slice(0, 4);

  return (
    <section className="relative border-t border-line bg-chalk px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 bg-grid-ink opacity-40" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
              Upcoming
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              On the board next
            </h2>
            <p className="mt-2 max-w-lg text-sm text-mist">
              Verified Hyderabad listings with official registration links.
            </p>
          </div>
          <Link
            href="/events"
            className="shrink-0 text-sm font-semibold text-ink underline-offset-4 hover:text-signal hover:underline"
          >
            See all →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <VenlixPixelLoader />
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-xl border border-line bg-paper px-6 py-12 text-center">
            <p className="font-display text-xl font-bold text-ink">Nothing open right now</p>
            <p className="mt-2 text-sm text-mist">
              New drops usually land with the next reel. Browse the full board or join the channel.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/events" className="h-11 rounded-md bg-ink px-5 text-sm font-semibold leading-[2.75rem] text-white">
                Browse events
              </Link>
              <Link href="/community" className="h-11 rounded-md border border-line px-5 text-sm font-semibold leading-[2.75rem] text-ink">
                Join channel
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {featured.map((evt) => (
              <EventCardRow key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
