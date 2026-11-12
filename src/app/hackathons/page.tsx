"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { getEvents, trackClick } from "@/lib/storage";
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
  const [hackathons, setHackathons] = useState<EventItem[]>([]);

  useEffect(() => {
    const list = getEvents().filter((e) => e.type === "hackathon" && e.status === "published");
    setHackathons(list);
  }, []);

  const nextHackathon = hackathons[0];
  const isNextEnded = nextHackathon ? getEventStatus(nextHackathon) === "ended" : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
          CURATED TRACK
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
          Hyderabad Hackathons
        </h1>
        <p className="mt-3 text-base text-slate max-w-2xl leading-relaxed">
          Overnight sprints, cash prize pools, and zero fluff. Only hackathons with verified offline venues and real engineering judges make this list.
        </p>
      </div>

      {/* Featured Next Hackathon Highlight Card */}
      {nextHackathon && (
        <div className="mb-12 bg-paper border-2 border-navy-900 rounded-3xl overflow-hidden shadow-md">
          {nextHackathon.poster_url && (
            <TypographicPoster
              title={nextHackathon.title}
              type={nextHackathon.type}
              date={nextHackathon.start_at}
              venue={nextHackathon.venue_name}
              posterUrl={nextHackathon.poster_url}
              aspectRatio="banner"
            />
          )}
          <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-rule">
            <div>
              <span className="text-[11px] font-semibold tracking-eyebrow uppercase text-rust block mb-1">
                NEXT UPCOMING HACKATHON · DEADLINE RADAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
                {nextHackathon.title}
              </h2>
            </div>
            <div className="flex flex-col sm:items-end">
              {isNextEnded ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate bg-surface border border-rule">
                  Registrations Closed
                </span>
              ) : (
                <>
                  <span className="text-xs text-slate mb-1 font-medium">Registration closes in:</span>
                  <CountdownDisplay targetDate={nextHackathon.deadline_at} />
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-slate mb-6 leading-relaxed">
            {nextHackathon.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
            <div className="bg-surface p-3.5 border border-rule rounded-xl">
              <span className="text-slate block text-[10px] uppercase font-semibold">Venue</span>
              <strong className="text-navy-900 mt-0.5 block truncate">{nextHackathon.venue_name.split(",")[0]}</strong>
            </div>
            <div className="bg-surface p-3.5 border border-rule rounded-xl">
              <span className="text-slate block text-[10px] uppercase font-semibold">Prize Pool</span>
              <strong className="text-emerald-600 mt-0.5 block truncate">{nextHackathon.prize || "Prizes & Grants"}</strong>
            </div>
            <div className="bg-surface p-3.5 border border-rule rounded-xl">
              <span className="text-slate block text-[10px] uppercase font-semibold">Dates</span>
              <strong className="text-navy-900 mt-0.5 block">{formatShortDate(nextHackathon.start_at)}</strong>
            </div>
            <div className="bg-surface p-3.5 border border-rule rounded-xl">
              <span className="text-slate block text-[10px] uppercase font-semibold">Team Size</span>
              <strong className="text-navy-900 mt-0.5 block">{nextHackathon.team_size}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isNextEnded ? (
              <span className="h-11 px-6 rounded-full bg-rule text-slate font-semibold text-xs tracking-wide inline-flex items-center justify-center cursor-not-allowed">
                Registrations Closed
              </span>
            ) : (
              <a
                href={sanitizeExternalUrl(nextHackathon.register_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("register", nextHackathon.id, "hackathons_featured_card")}
                className="h-11 px-6 rounded-full bg-emerald text-white font-semibold text-xs tracking-wide hover:bg-emerald-600 active:scale-95 transition-all inline-flex items-center justify-center shadow-xs"
              >
                Register on Official Site &rarr;
              </a>
            )}
            <Link
              href={`/events/${nextHackathon.slug}`}
              className="h-11 px-5 rounded-full border border-rule bg-paper text-navy-900 font-semibold text-xs hover:border-navy-900/40 inline-flex items-center justify-center transition-colors shadow-xs"
            >
              Full Details
            </Link>
            {nextHackathon.reel_url && (
              <a
                href={sanitizeExternalUrl(nextHackathon.reel_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("instagram", nextHackathon.id, "hackathons_featured_reel")}
                className="h-11 px-5 rounded-full border border-rule bg-paper text-navy-900 font-semibold text-xs hover:border-navy-900/40 inline-flex items-center justify-center transition-colors shadow-xs"
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
