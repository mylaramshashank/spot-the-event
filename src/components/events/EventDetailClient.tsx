"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { isEventSaved, toggleSaveEventId, trackClick } from "@/lib/storage";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { formatDate, formatTime, getEventStatus, getDeadlineLabel, sanitizeExternalUrl } from "@/lib/utils";
import { StatusBadge, TypeBadge } from "@/components/common/StatusBadge";
import { TypographicPoster } from "@/components/common/TypographicPoster";
import { StickyMobileActionBar } from "@/components/events/StickyMobileActionBar";
import { EventCardRow } from "@/components/events/EventCardRow";
import { getGoogleCalendarUrl } from "@/lib/calendar";

interface EventDetailClientProps {
  event: EventItem;
  allEvents: EventItem[];
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex splitting by markdown links, raw urls, and bold text **...**
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Check **bold**
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-navy-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Check [label](url)
    const mdMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdMatch) {
      const [, label, url] = mdMatch;
      return (
        <a
          key={idx}
          href={sanitizeExternalUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald hover:underline font-semibold inline-flex items-center gap-0.5 underline-offset-2 transition-colors"
        >
          <span>{label}</span>
          <svg className="w-3.5 h-3.5 opacity-75 shrink-0 inline ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }

    // Check bare URL
    if (/^https?:\/\//.test(part)) {
      let cleanUrl = part;
      let trailingPunct = "";
      if (/[.,;:)]$/.test(cleanUrl)) {
        trailingPunct = cleanUrl.slice(-1);
        cleanUrl = cleanUrl.slice(0, -1);
      }
      return (
        <span key={idx}>
          <a
            href={sanitizeExternalUrl(cleanUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald hover:underline font-semibold inline-flex items-center gap-0.5 underline-offset-2 transition-colors break-all"
          >
            <span>{cleanUrl}</span>
            <svg className="w-3.5 h-3.5 opacity-75 shrink-0 inline ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {trailingPunct}
        </span>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}

function renderDescriptionWithLinks(text: string) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 font-sans text-xs sm:text-sm text-navy-900/90 leading-relaxed">
      {lines.map((rawLine, lineIdx) => {
        const line = rawLine.trim();

        if (!line) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Alert Callout (starts with ⚠️ or 🚨 or [ALERT])
        if (line.startsWith("⚠️") || line.startsWith("🚨") || line.startsWith("[ALERT]")) {
          return (
            <div
              key={lineIdx}
              className="my-3 p-3 sm:p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-amber-950 text-xs sm:text-sm font-medium leading-relaxed shadow-2xs"
            >
              {parseInlineFormatting(line)}
            </div>
          );
        }

        // Section headings (e.g. "What We'll Cover:", "Event Highlights:", "Important Links:", etc.)
        const isHeading = /^[A-Za-z0-9\s'&—/]+:$/.test(line) && !line.startsWith("•") && !line.startsWith("-") && line.length < 50;
        if (isHeading) {
          return (
            <h3
              key={lineIdx}
              className="font-display font-bold text-navy-900 text-sm sm:text-base pt-3 pb-1 tracking-tight flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
              <span>{line.replace(/:$/, "")}</span>
            </h3>
          );
        }

        // Bullet points
        if (line.startsWith("•") || line.startsWith("-")) {
          const content = line.replace(/^[•-]\s*/, "");
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 py-0.5">
              <span className="text-emerald font-bold mt-0.5 shrink-0 text-sm leading-none">•</span>
              <span className="flex-1">{parseInlineFormatting(content)}</span>
            </div>
          );
        }

        // Default regular paragraph line
        return (
          <p key={lineIdx} className="py-0.5">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

export function EventDetailClient({ event: initialEvent, allEvents: initialAllEvents }: EventDetailClientProps) {
  const { events: liveEvents } = useLiveEvents();
  const [saved, setSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Prefer live updated event if available in client state, else initialEvent from SSR
  const event = liveEvents.find((e) => e.id === initialEvent.id) || initialEvent;
  const allEvents = liveEvents.length > 0 ? liveEvents : initialAllEvents;

  useEffect(() => {
    if (event) {
      setSaved(isEventSaved(event.id));
    }
  }, [event]);

  const status = getEventStatus(event);
  const isEnded = status === "ended";
  const deadlineLabel = getDeadlineLabel(event);

  const handleSave = () => {
    const isNowSaved = toggleSaveEventId(event.id);
    setSaved(isNowSaved);
  };

  const handleRegister = () => {
    trackClick("register", event.id, "detail_page_primary");
  };

  const handleWhatsAppShare = () => {
    trackClick("share", event.id, "whatsapp_share_button");
    const origin = typeof window !== "undefined" ? window.location.origin : "https://spot-the-event.vercel.app";
    const shareText = encodeURIComponent(
      `Check out ${event.title} in Hyderabad!\nDate: ${formatDate(event.start_at)}\nVenue: ${event.venue_name}\n${isEnded ? "Details" : "Register"}: ${origin}/events/${event.slug}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => {});
    }
  };

  // Related events
  const relatedEvents = allEvents
    .filter((e) => e.id !== event.id && (e.type === event.type || e.city === event.city))
    .slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-16">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/events"
          className="text-xs font-sans font-semibold text-slate hover:text-navy-900 inline-flex items-center gap-1.5 transition-colors"
        >
          &larr; Back to all events
        </Link>
      </div>

      {/* Ended Banner if past */}
      {isEnded && (
        <div className="mb-6 p-4 bg-paper border border-rule rounded-2xl shadow-xs flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-slate mt-1.5 shrink-0" />
          <div className="text-xs sm:text-sm text-slate">
            <strong className="text-navy-900 font-bold block mb-0.5">
              This event has ended or registrations are closed.
            </strong>
            You can still review the details below or explore the next upcoming events.
          </div>
        </div>
      )}

      {/* Event Header Card */}
      <div className="bg-paper border border-rule rounded-3xl overflow-hidden mb-8 shadow-sm">
        {/* Poster or Typographic Poster */}
        <TypographicPoster
          title={event.title}
          type={event.type}
          date={event.start_at}
          venue={event.venue_name}
          posterUrl={event.poster_url}
          aspectRatio="banner"
        />

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <TypeBadge type={event.type} />
            <StatusBadge status={status} label={deadlineLabel} />
            {event.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-eyebrow uppercase text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Verified Organizer
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 leading-[1.15] tracking-tight">
            {event.title}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-sm text-slate">
            <span>
              Organized by <strong className="text-navy-900 font-bold">{event.organizer}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 bg-emerald-100/80 border border-emerald/30 px-3 py-1 rounded-full">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="text-emerald-600 shrink-0"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Venue: {event.venue_name.split(",")[0]}</span>
            </span>
          </div>

          {/* Mobile quick reel CTA */}
          {event.reel_url && sanitizeExternalUrl(event.reel_url) !== "#" && (
            <div className="mt-4 flex sm:hidden">
              <a
                href={sanitizeExternalUrl(event.reel_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("instagram", event.id, "detail_mobile_watch_reel")}
                className="h-10 px-4 rounded-full border border-navy-900/20 bg-paper text-navy-900 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs"
              >
                Watch reel &rarr;
              </a>
            </div>
          )}

          {/* Desktop Primary Actions */}
          <div className="mt-6 hidden sm:flex items-center gap-3 pt-6 border-t border-rule">
            <a
              href={isEnded ? "#" : sanitizeExternalUrl(event.register_url)}
              target={isEnded ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={isEnded ? (e) => e.preventDefault() : handleRegister}
              className={`h-11 px-6 rounded-full font-semibold text-sm flex items-center justify-center transition-all shadow-xs ${
                isEnded
                  ? "bg-rule text-slate cursor-not-allowed"
                  : "bg-emerald text-white hover:bg-emerald-600 active:scale-[0.98]"
              }`}
            >
              {isEnded ? "Registrations Closed" : "Register on Official Site \u2192"}
            </a>

            <button
              type="button"
              onClick={handleSave}
              className={`h-11 px-5 rounded-full border font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs ${
                saved
                  ? "bg-navy-900 text-offwhite border-navy-900"
                  : "bg-paper border-rule text-navy-900 hover:border-navy-900/40"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>{saved ? "Saved to phone" : "Save event"}</span>
            </button>

            {event.reel_url && (
              <a
                href={sanitizeExternalUrl(event.reel_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("instagram", event.id, "detail_watch_reel")}
                className="h-11 px-5 rounded-full border border-rule bg-paper text-navy-900 font-semibold text-xs flex items-center gap-2 hover:border-navy-900/40 transition-colors shadow-xs"
              >
                Watch reel &rarr;
              </a>
            )}

            {isEnded && sanitizeExternalUrl(event.register_url) !== "#" && (
              <a
                href={sanitizeExternalUrl(event.register_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRegister}
                className="h-11 px-5 rounded-full border border-rule bg-paper text-slate font-semibold text-xs flex items-center gap-2 hover:text-navy-900 hover:border-navy-900/40 transition-colors shadow-xs"
              >
                Official Event Page &rarr;
              </a>
            )}
          </div>
        </div>
      </div>

      {/* "Why I featured this" - Shashank's Editorial Note */}
      {event.featured_note && (
        <div className="mb-8 p-5 sm:p-6 bg-paper border-l-4 border-l-emerald border-y border-r border-rule rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
            WHY I FEATURED THIS · SHASHANK’S NOTE
          </span>
          <p className="text-sm sm:text-base text-navy-900 leading-relaxed italic">
            &ldquo;{event.featured_note}&rdquo;
          </p>
        </div>
      )}

      {/* Key Facts in a 2-Column Definition List */}
      <div className="mb-8 bg-paper border border-rule rounded-sm p-5 sm:p-7">
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-4 pb-2 border-b border-rule">
          Key Facts
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 font-sans">
          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">When</dt>
            <dd className="mt-1 text-sm font-normal text-slate">
              {formatDate(event.start_at)} ({formatTime(event.start_at)})
            </dd>
          </div>

          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Where</dt>
            <dd className="mt-1 text-sm font-normal text-slate">
              {event.venue_name}
              {event.venue_map_url && (
                <a
                  href={sanitizeExternalUrl(event.venue_map_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-medium text-emerald hover:underline mt-1"
                >
                  View on Google Maps &rarr;
                </a>
              )}
            </dd>
          </div>

          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Fee</dt>
            <dd className="mt-1 text-sm font-normal text-slate">{event.fee_text}</dd>
          </div>

          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Eligibility</dt>
            <dd className="mt-1 text-sm font-normal text-slate">{event.eligibility}</dd>
          </div>

          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Team Size</dt>
            <dd className="mt-1 text-sm font-normal text-slate">{event.team_size}</dd>
          </div>

          {event.prize && (
            <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
              <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Prize Pool</dt>
              <dd className="mt-1 text-sm font-normal text-emerald">{event.prize}</dd>
            </div>
          )}

          <div className="pb-3.5 border-b border-rule/50 sm:border-b-0 sm:pb-0">
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Organizer</dt>
            <dd className="mt-1 text-sm font-normal text-slate">{event.organizer}</dd>
          </div>

          <div>
            <dt className="text-[13px] font-extrabold tracking-wider uppercase text-navy-900">Registration Deadline</dt>
            <dd className="mt-1 text-sm font-normal text-rust">
              {formatDate(event.deadline_at)} ({deadlineLabel})
            </dd>
          </div>
        </dl>
      </div>

      {/* Description */}
      <div className="mb-8 bg-paper border border-rule rounded-sm p-5 sm:p-7">
        <h2 className="font-display text-2xl font-bold text-navy-900 mb-3 pb-2 border-b border-rule">
          About this event
        </h2>
        <div className="text-navy-900/90 leading-relaxed">
          {renderDescriptionWithLinks(event.description)}
        </div>
      </div>

      {/* Utility Actions: Calendar, Share, WhatsApp */}
      <div className="mb-12 p-5 bg-paper border border-rule rounded-sm">
        <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-3">
          Share & Reminder
        </span>
        <div className="flex flex-wrap gap-2.5">
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("calendar", event.id, "google_cal_link")}
            className="h-10 px-3.5 bg-paper border border-rule hover:border-navy-900/40 rounded-sm text-xs font-sans font-semibold text-navy-900 transition-colors inline-flex items-center gap-1.5"
          >
            Google Calendar
          </a>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="h-10 px-3.5 bg-paper border border-rule hover:border-navy-900/40 rounded-sm text-xs font-sans font-semibold text-navy-900 transition-colors inline-flex items-center gap-1.5"
          >
            Share on WhatsApp
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-10 px-3.5 bg-paper border border-rule hover:border-navy-900/40 rounded-sm text-xs font-sans font-semibold text-navy-900 transition-colors inline-flex items-center gap-1.5"
          >
            {shareCopied ? "Link Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* More Like This */}
      {relatedEvents.length > 0 && (
        <div className="border-t border-rule pt-8">
          <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
            MORE LIKE THIS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-navy-900 mb-4">
            Other upcoming opportunities
          </h2>
          <div className="space-y-3">
            {relatedEvents.map((rel) => (
              <EventCardRow key={rel.id} event={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar for Mobile */}
      <StickyMobileActionBar event={event} />
    </div>
  );
}
