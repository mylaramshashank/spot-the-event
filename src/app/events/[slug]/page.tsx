"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { EventItem } from "@/types";
import {
  getEvents,
  isEventSaved,
  toggleSaveEventId,
  trackClick,
} from "@/lib/storage";
import {
  formatDate,
  formatTime,
  getEventStatus,
  getDeadlineLabel,
  sanitizeExternalUrl,
} from "@/lib/utils";
import { StatusBadge, TypeBadge } from "@/components/common/StatusBadge";
import { TypographicPoster } from "@/components/common/TypographicPoster";
import { StickyMobileActionBar } from "@/components/events/StickyMobileActionBar";
import { EventCardRow } from "@/components/events/EventCardRow";
import { getGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { SITE, eventShareUrl } from "@/lib/site";
import { VenlixPixelLoader } from "@/components/common/VenlixLogo";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventItem | null | undefined>(undefined);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [regCopied, setRegCopied] = useState(false);

  useEffect(() => {
    const list = getEvents();
    setAllEvents(list);
    const found = list.find((e) => e.slug === slug);
    setEvent(found || null);
    if (found) setSaved(isEventSaved(found.id));
  }, [slug]);

  if (event === undefined) {
    return (
      <div className="flex justify-center py-24">
        <VenlixPixelLoader />
      </div>
    );
  }

  if (event === null) {
    return notFound();
  }

  const status = getEventStatus(event);
  const isEnded = status === "ended";
  const deadlineLabel = getDeadlineLabel(event);

  const handleSave = () => setSaved(toggleSaveEventId(event.id));
  const handleRegister = () => trackClick("register", event.id, "detail_page_primary");

  const handleWhatsAppShare = () => {
    trackClick("share", event.id, "whatsapp_share_button");
    const shareText = encodeURIComponent(
      `${event.title} · Hyderabad\n${formatDate(event.start_at)}\n${event.venue_name}\n${eventShareUrl(event.slug)}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
  };

  const handleCopyLink = async () => {
    trackClick("share", event.id, "copy_event_link");
    await navigator.clipboard.writeText(eventShareUrl(event.slug));
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleCopyRegister = async () => {
    trackClick("share", event.id, "copy_register_link");
    await navigator.clipboard.writeText(event.register_url);
    setRegCopied(true);
    setTimeout(() => setRegCopied(false), 2000);
  };

  const relatedEvents = allEvents
    .filter((e) => e.id !== event.id && e.status === "published" && (e.type === event.type || e.city === event.city))
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_at,
    endDate: event.end_at,
    eventAttendanceMode:
      event.mode === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: isEnded
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue_name,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: "IN",
      },
    },
    description: event.description,
    offers: {
      "@type": "Offer",
      price: event.is_free ? "0" : event.fee_text.match(/\d[\d,]*/)?.[0]?.replace(/,/g, "") || "0",
      priceCurrency: "INR",
      url: sanitizeExternalUrl(event.register_url),
      availability: isEnded ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      validThrough: event.deadline_at,
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      url: SITE.url,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:px-6 sm:py-12 sm:pb-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mb-6">
        <Link href="/events" className="text-xs font-semibold text-mist transition hover:text-ink">
          ← Back to all events
        </Link>
      </div>

      {isEnded && (
        <div className="mb-6 rounded-xl border border-line bg-paper p-4 text-sm text-mist">
          <strong className="mb-0.5 block font-bold text-ink">
            This event has ended or registrations are closed.
          </strong>
          You can still review details below or explore related upcoming events.
        </div>
      )}

      <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-paper">
        <TypographicPoster
          title={event.title}
          type={event.type}
          date={event.start_at}
          venue={event.venue_name}
          aspectRatio="banner"
        />
        <div className="p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TypeBadge type={event.type} />
            <StatusBadge status={status} label={deadlineLabel} />
            {event.verified && (
              <span className="rounded-md bg-signal-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-signal-dark">
                Verified
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          <p className="mt-2 text-sm text-mist">
            Organized by <strong className="font-bold text-ink">{event.organizer}</strong>
          </p>

          <div className="mt-6 hidden items-center gap-3 border-t border-line pt-6 sm:flex">
            <a
              href={isEnded ? "#" : sanitizeExternalUrl(event.register_url)}
              target={isEnded ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={isEnded ? (e) => e.preventDefault() : handleRegister}
              className={`inline-flex h-11 items-center rounded-md px-6 text-sm font-semibold transition ${
                isEnded
                  ? "cursor-not-allowed bg-surface text-mist"
                  : "bg-signal text-white hover:bg-signal-dark"
              }`}
            >
              {isEnded ? "Registrations closed" : "Register on official site →"}
            </a>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex h-11 items-center gap-2 rounded-md border px-5 text-xs font-semibold ${
                saved ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink"
              }`}
            >
              {saved ? "Saved" : "Save event"}
            </button>
            <button
              type="button"
              onClick={handleCopyRegister}
              className="inline-flex h-11 items-center rounded-md border border-line bg-paper px-5 text-xs font-semibold text-ink"
            >
              {regCopied ? "Registration link copied" : "Copy registration link"}
            </button>
            {event.reel_url && (
              <a
                href={sanitizeExternalUrl(event.reel_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("instagram", event.id, "detail_watch_reel")}
                className="inline-flex h-11 items-center rounded-md border border-line px-5 text-xs font-semibold text-ink"
              >
                Watch reel →
              </a>
            )}
          </div>
        </div>
      </div>

      {event.featured_note && (
        <div className="mb-8 rounded-xl border border-line border-l-4 border-l-signal bg-paper p-5 sm:p-6">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-eyebrow text-signal-dark">
            Why it&apos;s featured · {SITE.curator.name}
          </span>
          <p className="text-sm italic leading-relaxed text-ink sm:text-base">
            “{event.featured_note}”
          </p>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-line bg-paper p-5 sm:p-7">
        <h2 className="mb-4 border-b border-line pb-2 font-display text-2xl font-bold text-ink">
          Key facts
        </h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">When</dt>
            <dd className="mt-1 font-medium text-ink">
              {formatDate(event.start_at)} ({formatTime(event.start_at)})
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Where</dt>
            <dd className="mt-1 font-medium text-ink">
              {event.venue_name}
              {event.venue_map_url && (
                <a
                  href={sanitizeExternalUrl(event.venue_map_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-xs text-signal hover:underline"
                >
                  View on Google Maps →
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Fee</dt>
            <dd className="mt-1 font-medium text-ink">{event.fee_text}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Eligibility</dt>
            <dd className="mt-1 font-medium text-ink">{event.eligibility}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Team size</dt>
            <dd className="mt-1 font-medium text-ink">{event.team_size}</dd>
          </div>
          {event.prize && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Prize pool</dt>
              <dd className="mt-1 font-medium text-signal">{event.prize}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Organizer</dt>
            <dd className="mt-1 font-medium text-ink">{event.organizer}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-mist">Deadline</dt>
            <dd className="mt-1 font-medium text-alert">
              {formatDate(event.deadline_at)} ({deadlineLabel})
            </dd>
          </div>
        </dl>
      </div>

      <div className="mb-8 rounded-xl border border-line bg-paper p-5 sm:p-7">
        <h2 className="mb-3 border-b border-line pb-2 font-display text-2xl font-bold text-ink">
          About this event
        </h2>
        <div className="whitespace-pre-line text-sm leading-relaxed text-ink/90 sm:text-base">
          {event.description}
        </div>
      </div>

      <div className="mb-12 rounded-xl border border-line bg-paper p-5">
        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
          Share & reminder
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => downloadIcsFile(event)} className="h-10 rounded-md border border-line px-3.5 text-xs font-semibold text-ink">
            Download .ICS
          </button>
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("calendar", event.id, "google_cal_link")}
            className="inline-flex h-10 items-center rounded-md border border-line px-3.5 text-xs font-semibold text-ink"
          >
            Google Calendar
          </a>
          <button type="button" onClick={handleWhatsAppShare} className="h-10 rounded-md border border-line px-3.5 text-xs font-semibold text-ink">
            Share on WhatsApp
          </button>
          <button type="button" onClick={handleCopyLink} className="h-10 rounded-md border border-line px-3.5 text-xs font-semibold text-ink">
            {shareCopied ? "Page link copied" : "Copy page link"}
          </button>
          <button type="button" onClick={handleCopyRegister} className="h-10 rounded-md border border-line px-3.5 text-xs font-semibold text-ink sm:hidden">
            {regCopied ? "Reg link copied" : "Copy registration link"}
          </button>
        </div>
      </div>

      {relatedEvents.length > 0 && (
        <div className="border-t border-line pt-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">More like this</p>
          <h2 className="mb-4 font-display text-2xl font-bold text-ink sm:text-3xl">
            Other upcoming opportunities
          </h2>
          <div className="space-y-3">
            {relatedEvents.map((rel) => (
              <EventCardRow key={rel.id} event={rel} />
            ))}
          </div>
        </div>
      )}

      <StickyMobileActionBar event={event} />
    </div>
  );
}
