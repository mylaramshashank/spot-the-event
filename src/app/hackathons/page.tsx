"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { trackClick } from "@/lib/storage";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { EventCardRow } from "@/components/events/EventCardRow";
import { TypographicPoster } from "@/components/common/TypographicPoster";
import { formatShortDate, getEventStatus, sanitizeExternalUrl } from "@/lib/utils";

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft({ days, hours, minutes });
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 font-mono text-sm sm:text-base font-semibold text-rust">
      <div className="bg-rust/10 px-2 py-1 rounded border border-rust/20">
        <span>{timeLeft.days}d</span>
      </div>
      <span>:</span>
      <div className="bg-rust/10 px-2 py-1 rounded border border-rust/20">
        <span>{timeLeft.hours}h</span>
      </div>
      <span>:</span>
      <div className="bg-rust/10 px-2 py-1 rounded border border-rust/20">
        <span>{timeLeft.minutes}m</span>
      </div>
    </div>
  );
}

export default function HackathonsPage() {
  const { events } = useLiveEvents();
  const hackathons = events.filter((e) => e.type === "hackathon" && e.status === "published");

  const nextHackathon = hackathons[0];
  const isNextEnded = nextHackathon ? getEventStatus(nextHackathon) === "ended" : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
          CURATED TRACK
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Hyderabad Hackathons
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
          Overnight sprints, cash prize pools, and zero fluff. Only hackathons with verified offline venues and real engineering judges make this list.
        </p>
      </div>

      {/* Featured Next Hackathon Highlight Card (compact split layout for all hackathons) */}
      {nextHackathon && (
        <div className="mb-10 bg-paper border border-navy-900/20 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-[360px_1fr]">
          <div className="bg-white border-b lg:border-b-0 lg:border-r border-rule flex items-center justify-center">
            <TypographicPoster
              title={nextHackathon.title}
              type={nextHackathon.type}
              date={nextHackathon.start_at}
              venue={nextHackathon.venue_name}
              posterUrl={nextHackathon.poster_url}
              aspectRatio="video"
              className="border-b-0"
            />
          </div>

          <div className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 pb-3 border-b border-rule">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold tracking-eyebrow uppercase text-rust block mb-0.5">
                    NEXT UPCOMING HACKATHON · DEADLINE RADAR
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-navy-900 leading-snug">
                    {nextHackathon.title}
                  </h2>
                </div>
                <div className="flex flex-col sm:items-end shrink-0">
                  {isNextEnded ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate bg-surface border border-rule">
                      Registrations Closed
                    </span>
                  ) : (
                    <>
                      <span className="text-[11px] text-slate mb-1 font-medium">Closes in:</span>
                      <CountdownDisplay targetDate={nextHackathon.deadline_at} />
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate mb-4 leading-relaxed line-clamp-2">
                {nextHackathon.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-4">
                <div className="bg-surface px-3 py-2 border border-rule rounded-xl">
                  <span className="text-slate block text-[10px] uppercase font-semibold">Venue</span>
                  <strong className="text-navy-900 mt-0.5 block truncate">{nextHackathon.venue_name.split(",")[0]}</strong>
                </div>
                <div className="bg-surface px-3 py-2 border border-rule rounded-xl">
                  <span className="text-slate block text-[10px] uppercase font-semibold">Prize Pool</span>
                  <strong className="text-emerald-600 mt-0.5 block truncate">{nextHackathon.prize || "Prizes & Grants"}</strong>
                </div>
                <div className="bg-surface px-3 py-2 border border-rule rounded-xl">
                  <span className="text-slate block text-[10px] uppercase font-semibold">Dates</span>
                  <strong className="text-navy-900 mt-0.5 block">{formatShortDate(nextHackathon.start_at)}</strong>
                </div>
                <div className="bg-surface px-3 py-2 border border-rule rounded-xl">
                  <span className="text-slate block text-[10px] uppercase font-semibold">Team Size</span>
                  <strong className="text-navy-900 mt-0.5 block truncate">{nextHackathon.team_size}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isNextEnded ? (
                <span className="h-9 px-4 rounded-full bg-surface text-slate border border-rule font-semibold text-xs inline-flex items-center justify-center cursor-not-allowed">
                  Registrations Closed
                </span>
              ) : (
                <a
                  href={sanitizeExternalUrl(nextHackathon.register_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("register", nextHackathon.id, "hackathons_featured_card")}
                  className="h-9 px-5 rounded-full bg-emerald text-white font-semibold text-xs tracking-wide hover:bg-emerald-600 active:scale-95 transition-all inline-flex items-center justify-center shadow-xs"
                >
                  Register on Official Site &rarr;
                </a>
              )}
              <Link
                href={`/events/${nextHackathon.slug}`}
                className="h-9 px-4 rounded-full border border-rule bg-paper text-navy-900 font-semibold text-xs hover:border-navy-900/40 inline-flex items-center justify-center transition-colors"
              >
                Full Details
              </Link>
              {nextHackathon.reel_url && (
                <a
                  href={sanitizeExternalUrl(nextHackathon.reel_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("instagram", nextHackathon.id, "hackathons_featured_reel")}
                  className="h-9 px-4 rounded-full border border-rule bg-paper text-navy-900 font-semibold text-xs hover:border-navy-900/40 inline-flex items-center justify-center transition-colors"
                >
                  Watch Reel &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List of All Hackathons */}
      <div>
        <h3 className="text-2xl font-bold text-navy-900 mb-4 pb-2 border-b border-rule">
          All Upcoming Hackathons ({hackathons.length})
        </h3>
        <div className="space-y-3">
          {hackathons.map((hack) => (
            <EventCardRow key={hack.id} event={hack} />
          ))}
        </div>
      </div>
    </div>
  );
}
