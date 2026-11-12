"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { getEventStatus, getDeadlineLabel, sanitizeExternalUrl } from "@/lib/utils";
import { StatusBadge, TypeBadge } from "../common/StatusBadge";
import { isEventSaved, toggleSaveEventId, trackClick } from "@/lib/storage";

interface EventCardRowProps {
  event: EventItem;
  showSaveButton?: boolean;
}

export function EventCardRow({ event, showSaveButton = true }: EventCardRowProps) {
  const [saved, setSaved] = useState(false);
  const status = getEventStatus(event);
  const deadlineLabel = getDeadlineLabel(event);

  useEffect(() => {
    setSaved(isEventSaved(event.id));
    const handleSavedUpdate = () => setSaved(isEventSaved(event.id));
    window.addEventListener("venlix_saved_updated", handleSavedUpdate);
    return () => window.removeEventListener("venlix_saved_updated", handleSavedUpdate);
  }, [event.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleSaveEventId(event.id));
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick("register", event.id, "row_quick_register");
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-line bg-paper p-4 transition hover:border-ink/25 sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-ink text-white">
            <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-signal">
              {new Date(event.start_at)
                .toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })
                .toUpperCase()}
            </span>
            <span className="mt-0.5 text-2xl font-bold leading-none">
              {new Date(event.start_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                timeZone: "Asia/Kolkata",
              })}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={event.type} />
              <StatusBadge status={status} label={deadlineLabel} />
            </div>
            <h3 className="text-lg font-bold leading-snug text-ink transition group-hover:text-signal sm:text-xl">
              <Link href={`/events/${event.slug}`}>
                <span className="absolute inset-0" aria-hidden="true" />
                {event.title}
              </Link>
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist sm:text-sm">
              <span className="font-semibold text-ink">{event.venue_name.split(",")[0]}</span>
              <span>·</span>
              <span>{event.fee_text}</span>
              {event.prize && (
                <>
                  <span>·</span>
                  <span className="max-w-[180px] truncate font-semibold text-signal">{event.prize}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-line/60 pt-3 sm:justify-end sm:border-0 sm:pt-0">
          {showSaveButton && (
            <button
              type="button"
              onClick={handleSaveToggle}
              aria-label={saved ? "Unsave event" : "Save event"}
              className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                saved
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-paper text-mist hover:border-ink hover:text-ink"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}
          <a
            href={sanitizeExternalUrl(event.register_url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRegisterClick}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-soft active:scale-[0.98]"
          >
            Register →
          </a>
        </div>
      </div>
    </article>
  );
}
