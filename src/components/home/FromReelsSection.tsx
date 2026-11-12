"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { TypographicPoster } from "../common/TypographicPoster";
import { trackClick } from "@/lib/storage";
import { sanitizeExternalUrl } from "@/lib/utils";
import { SITE } from "@/lib/site";

interface FromReelsSectionProps {
  events: EventItem[];
}

export function FromReelsSection({ events }: FromReelsSectionProps) {
  const reelEvents = events.filter((e) => e.reel_url).slice(0, 3);
  if (reelEvents.length === 0) return null;

  return (
    <section className="border-t border-line px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
              From the reels
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Seen on {SITE.curator.handle}
            </h2>
          </div>
          <a
            href={SITE.curator.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-semibold text-ink underline-offset-4 hover:text-signal hover:underline"
          >
            View Instagram →
          </a>
        </div>

        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory sm:mx-0 sm:px-0">
          {reelEvents.map((evt) => (
            <article
              key={evt.id}
              className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-line bg-paper sm:w-[320px]"
            >
              <TypographicPoster
                title={evt.title}
                type={evt.type}
                date={evt.start_at}
                venue={evt.venue_name}
                aspectRatio="video"
              />
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="line-clamp-2 text-xs leading-relaxed text-mist">
                  “{evt.featured_note}”
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-line/70 pt-3">
                  <a
                    href={sanitizeExternalUrl(evt.reel_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick("instagram", evt.id, "from_reels_section")}
                    className="text-xs font-medium text-mist hover:text-ink"
                  >
                    Watch reel →
                  </a>
                  <Link
                    href={`/events/${evt.slug}`}
                    className="inline-flex h-8 items-center rounded-md bg-ink px-3 text-xs font-semibold text-white"
                  >
                    Open event
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
