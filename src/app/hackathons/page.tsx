"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { getEvents, trackClick } from "@/lib/storage";
import { EventCardRow } from "@/components/events/EventCardRow";
import { formatShortDate, getEventStatus, sanitizeExternalUrl } from "@/lib/utils";
import { VenlixPixelLoader } from "@/components/common/VenlixLogo";

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 font-mono text-sm font-semibold text-alert">
      <span className="rounded-md border border-alert/20 bg-alert/10 px-2 py-1">{timeLeft.days}d</span>
      <span>:</span>
      <span className="rounded-md border border-alert/20 bg-alert/10 px-2 py-1">{timeLeft.hours}h</span>
      <span>:</span>
      <span className="rounded-md border border-alert/20 bg-alert/10 px-2 py-1">{timeLeft.minutes}m</span>
    </div>
  );
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const list = getEvents()
      .filter((e) => e.type === "hackathon" && e.status === "published")
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    setHackathons(list);
    setLoaded(true);
  }, []);

  const nextHackathon = hackathons.find((e) => getEventStatus(e) !== "ended") || hackathons[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-signal-dark">
          Curated track
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Hyderabad hackathons
        </h1>
        <p className="mt-3 max-w-2xl text-base text-mist">
          Overnight sprints with verified venues and real engineering judges. No fluff listings.
        </p>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-20">
          <VenlixPixelLoader />
        </div>
      ) : (
        <>
          {nextHackathon && (
            <div className="mb-12 rounded-2xl border-2 border-ink bg-paper p-6 sm:p-8">
              <div className="mb-4 flex flex-col justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-alert">
                    Next up · deadline radar
                  </p>
                  <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    {nextHackathon.title}
                  </h2>
                </div>
                <div className="sm:text-right">
                  <p className="mb-1 text-xs font-medium text-mist">Registration closes in</p>
                  <CountdownDisplay targetDate={nextHackathon.deadline_at} />
                </div>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-mist">{nextHackathon.description}</p>
              <div className="mb-6 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                {[
                  ["Venue", nextHackathon.venue_name.split(",")[0]],
                  ["Prize", nextHackathon.prize || "Prizes & grants"],
                  ["Dates", formatShortDate(nextHackathon.start_at)],
                  ["Team", nextHackathon.team_size],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-line bg-surface p-3.5">
                    <span className="block text-[10px] font-semibold uppercase text-mist">{label}</span>
                    <strong className="mt-0.5 block truncate text-ink">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={sanitizeExternalUrl(nextHackathon.register_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("register", nextHackathon.id, "hackathons_featured_card")}
                  className="inline-flex h-11 items-center rounded-md bg-signal px-6 text-xs font-semibold text-white hover:bg-signal-dark"
                >
                  Register on official site →
                </a>
                <Link
                  href={`/events/${nextHackathon.slug}`}
                  className="inline-flex h-11 items-center rounded-md border border-line px-5 text-xs font-semibold text-ink"
                >
                  Full details
                </Link>
              </div>
            </div>
          )}

          <h3 className="mb-4 border-b border-line pb-2 font-display text-2xl font-bold text-ink">
            All hackathons ({hackathons.length})
          </h3>
          {hackathons.length === 0 ? (
            <p className="text-sm text-mist">No hackathons listed yet. Check back after the next reel.</p>
          ) : (
            <div className="space-y-3">
              {hackathons.map((hack) => (
                <EventCardRow key={hack.id} event={hack} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
