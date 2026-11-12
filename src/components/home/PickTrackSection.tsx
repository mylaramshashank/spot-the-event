"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";

interface PickTrackSectionProps {
  events: EventItem[];
}

export function PickTrackSection({ events }: PickTrackSectionProps) {
  const hackathonsCount = events.filter((e) => e.type === "hackathon" && e.status === "published").length;
  const meetupsCount = events.filter(
    (e) => (e.type === "meetup" || e.type === "workshop") && e.status === "published"
  ).length;

  return (
    <section className="border-t border-line px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
          Pick a track
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          What are you showing up for?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/hackathons"
            className="group relative overflow-hidden rounded-xl border border-line bg-ink p-6 text-white transition hover:border-ink sm:p-8"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-signal/25 blur-3xl transition group-hover:bg-signal/35" />
            <p className="relative text-[11px] font-semibold uppercase tracking-eyebrow text-signal">
              High stakes · {hackathonsCount} listed
            </p>
            <h3 className="relative mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">
              Hackathons & overnight sprints
            </h3>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-white/65">
              Form a squad, ship for 36 hours, pitch at T-Hub, IIIT-H, JNTU — real prizes, real judges.
            </p>
            <span className="relative mt-8 inline-flex text-sm font-semibold text-signal">
              Explore hackathons →
            </span>
          </Link>

          <Link
            href="/events?type=meetup"
            className="group rounded-xl border border-line bg-paper p-6 transition hover:border-ink/30 sm:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
              Practical learning · {meetupsCount} listed
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
              Meetups & hands-on workshops
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
              Weekend sessions across Hitec City and Gachibowli — stacks, systems, and the local builder crowd.
            </p>
            <span className="mt-8 inline-flex text-sm font-semibold text-ink group-hover:text-signal">
              Browse meetups →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
