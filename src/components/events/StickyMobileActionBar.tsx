"use client";

import React, { useState, useEffect } from "react";
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
    const handleSavedUpdate = () => {
      setSaved(isEventSaved(event.id));
    };
    window.addEventListener("venlix_saved_updated", handleSavedUpdate);
    return () => window.removeEventListener("venlix_saved_updated", handleSavedUpdate);
  }, [event.id]);

  const handleToggle = () => {
    const isNowSaved = toggleSaveEventId(event.id);
    setSaved(isNowSaved);
  };

  const handleRegister = () => {
    trackClick("register", event.id, "sticky_mobile_bottom_bar");
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-offwhite/95 backdrop-blur-none border-t border-rule sm:hidden px-4 py-2.5 transition-transform"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 8px) + 8px)" }}
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleToggle}
          className={`h-12 w-12 shrink-0 rounded-full border flex items-center justify-center transition-all shadow-xs ${
            saved
              ? "bg-navy-900 text-offwhite border-navy-900"
              : "border-rule text-navy-900 bg-paper"
          }`}
          aria-label={saved ? "Remove from saved" : "Save event"}
        >
          <svg
            width="20"
            height="20"
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

        <a
          href={isEnded ? "#" : sanitizeExternalUrl(event.register_url)}
          target={isEnded ? "_self" : "_blank"}
          rel="noopener noreferrer"
          onClick={isEnded ? (e) => e.preventDefault() : handleRegister}
          className={`flex-1 h-12 rounded-full font-semibold text-sm flex items-center justify-center transition-all shadow-md ${
            isEnded
              ? "bg-rule text-slate cursor-not-allowed"
              : "bg-emerald text-white hover:bg-emerald-600 active:scale-[0.98]"
          }`}
        >
          {isEnded ? "Registrations Closed" : "Register Now"}
        </a>
      </div>
    </div>
  );
}
