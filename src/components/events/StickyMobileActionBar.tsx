"use client";

import React, { useEffect, useState } from "react";
import { EventItem } from "@/types";
import { isEventSaved, toggleSaveEventId, trackClick } from "@/lib/storage";
import { getEventStatus, sanitizeExternalUrl } from "@/lib/utils";

interface StickyMobileActionBarProps {
  event: EventItem;
}

export function StickyMobileActionBar({ event }: StickyMobileActionBarProps) {
  const [saved, setSaved] = useState(false);
  const status = getEventStatus(event);
  const isEnded = status === "ended";

  useEffect(() => {
    setSaved(isEventSaved(event.id));
    const handleSavedUpdate = () => setSaved(isEventSaved(event.id));
    window.addEventListener("venlix_saved_updated", handleSavedUpdate);
    return () => window.removeEventListener("venlix_saved_updated", handleSavedUpdate);
  }, [event.id]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-chalk/95 px-4 py-2.5 backdrop-blur-sm sm:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 8px) + 8px)" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <button
          type="button"
          onClick={() => setSaved(toggleSaveEventId(event.id))}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${
            saved ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink"
          }`}
          aria-label={saved ? "Remove from saved" : "Save event"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <a
          href={isEnded ? "#" : sanitizeExternalUrl(event.register_url)}
          target={isEnded ? "_self" : "_blank"}
          rel="noopener noreferrer"
          onClick={isEnded ? (e) => e.preventDefault() : () => trackClick("register", event.id, "sticky_mobile_bottom_bar")}
          className={`flex h-12 flex-1 items-center justify-center rounded-md text-sm font-semibold transition ${
            isEnded
              ? "cursor-not-allowed bg-surface text-mist"
              : "bg-signal text-white hover:bg-signal-dark active:scale-[0.98]"
          }`}
        >
          {isEnded ? "Registrations closed" : "Register now"}
        </a>
      </div>
    </div>
  );
}
