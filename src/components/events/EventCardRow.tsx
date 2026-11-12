"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { formatShortDate, getEventStatus, getDeadlineLabel, sanitizeExternalUrl } from "@/lib/utils";
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
    const handleSavedUpdate = () => {
      setSaved(isEventSaved(event.id));
    };
    window.addEventListener("venlix_saved_updated", handleSavedUpdate);
    return () => window.removeEventListener("venlix_saved_updated", handleSavedUpdate);
  }, [event.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSaveEventId(event.id);
    setSaved(isNowSaved);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick("register", event.id, "row_quick_register");
  };

  return (
    <div className="group relative bg-paper border border-rule hover:border-navy-900/30 transition-all duration-200 rounded-2xl overflow-hidden mb-3.5 p-4 sm:p-5 shadow-xs hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side: Date stamp + Event Meta */}
        <div className="flex items-start gap-4">
          {/* Flat Navy Date Stamp with smooth curved corners */}
          <div className="shrink-0 w-16 h-16 bg-navy-900 text-offwhite flex flex-col items-center justify-center rounded-xl border border-navy-700 active:scale-[0.97] transition-transform shadow-xs">
            <span className="text-[10px] font-semibold tracking-eyebrow uppercase text-emerald">
              {new Date(event.start_at).toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase()}
            </span>
            <span className="text-2xl font-bold leading-none mt-0.5 text-offwhite">
              {new Date(event.start_at).toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" })}
            </span>
          </div>

          {/* Title & Key details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={event.type} />
              <StatusBadge status={status} label={deadlineLabel} />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-navy-900 leading-snug group-hover:text-emerald-600 transition-colors">
              <Link
                href={`/events/${event.slug}`}
                className="hover:text-emerald-600 transition-colors"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {event.title}
              </Link>
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate">
              <span className="font-semibold text-navy-900">{event.venue_name.split(",")[0]}</span>
              <span>·</span>
              <span>{event.fee_text}</span>
              {event.prize && (
                <>
                  <span>·</span>
                  <span className="text-emerald-600 font-semibold truncate max-w-[180px]">
                    {event.prize}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="relative z-10 flex items-center justify-between sm:justify-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-rule/60">
          {showSaveButton && (
            <button
              type="button"
              onClick={handleSaveToggle}
              aria-label={saved ? "Unsave event" : "Save event"}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                saved
                  ? "bg-navy-900 text-offwhite border-navy-900 scale-105"
                  : "border-rule text-slate hover:border-navy-900 hover:text-navy-900 bg-paper"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}

          <a
            href={sanitizeExternalUrl(event.register_url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRegisterClick}
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-navy-900 text-offwhite text-xs sm:text-sm font-semibold tracking-wide hover:bg-navy-800 active:scale-95 transition-all shadow-xs"
          >
            Register &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
