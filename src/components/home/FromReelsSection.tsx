"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { TypographicPoster } from "../common/TypographicPoster";
import { trackClick } from "@/lib/storage";
import { sanitizeExternalUrl } from "@/lib/utils";

interface FromReelsSectionProps {
  events: EventItem[];
}

export function FromReelsSection({ events }: FromReelsSectionProps) {
  // Published events that have a valid Instagram reel link (most recently updated first)
  const reelEvents = events
    .filter((e) => e.status === "published" && e.reel_url && sanitizeExternalUrl(e.reel_url) !== "#")
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 12);

  const handleReelClick = (eventId: string) => {
    trackClick("instagram", eventId, "from_reels_section");
  };

  if (reelEvents.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
            03 / FROM THE REELS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 tracking-tight">
            Seen on @buildwithshashankk
          </h2>
        </div>
        <a
          href="https://instagram.com/buildwithshashankk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-sans font-semibold text-navy-900 hover:text-emerald transition-colors underline underline-offset-4"
        >
          View all reels &rarr;
        </a>
      </div>

      {/* Horizontal snap-scroll row with no scrollbars */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {reelEvents.map((evt) => (
          <div
            key={evt.id}
            className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-paper border border-rule hover:border-navy-900/40 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div>
              {/* Typographic poster / card */}
              <TypographicPoster
                title={evt.title}
                type={evt.type}
                date={evt.start_at}
                venue={evt.venue_name}
                posterUrl={evt.poster_url}
                aspectRatio="video"
              />

              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-eyebrow uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {evt.type}
                  </span>
                  <span className="text-slate text-xs">·</span>
                  <span className="text-slate text-xs font-medium truncate">{evt.venue_name.split(",")[0]}</span>
                </div>

                <p className="text-xs font-sans text-slate line-clamp-2 leading-relaxed">
                  &ldquo;{evt.featured_note}&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 sm:p-5 sm:pt-0 flex items-center justify-between border-t border-rule/50 mt-2 pt-3">
              <a
                href={sanitizeExternalUrl(evt.reel_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleReelClick(evt.id)}
                className="text-xs font-sans font-medium text-slate hover:text-navy-900 transition-colors"
              >
                Watch reel &rarr;
              </a>
              <Link
                href={`/events/${evt.slug}`}
                className="inline-flex items-center justify-center h-8 px-3 rounded-sm bg-navy-900 text-offwhite text-xs font-sans font-semibold hover:bg-navy-700 transition-colors"
              >
                Open event
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
