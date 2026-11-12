"use client";

import React from "react";
import Link from "next/link";
import { EventItem } from "@/types";

interface PickTrackSectionProps {
  events: EventItem[];
}

export function PickTrackSection({ events }: PickTrackSectionProps) {
  const hackathonsCount = events.filter((e) => e.type === "hackathon" && e.status === "published").length;
  const meetupsCount = events.filter((e) => (e.type === "meetup" || e.type === "workshop") && e.status === "published").length;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="mb-8">
        <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
          02 / PICK YOUR TRACK
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 tracking-tight">
          What are you building for?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Track 1: Hackathons */}
        <Link
          href="/hackathons"
          className="group relative bg-paper border border-rule hover:border-navy-900/40 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold tracking-eyebrow uppercase text-emerald-600">
                HIGH STAKES
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                {hackathonsCount} open now
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-navy-900 group-hover:text-emerald-600 transition-colors leading-tight">
              Hackathons & Overnight Sprints
            </h3>
            <p className="mt-3 text-sm text-slate leading-relaxed">
              Form a squad, write code for 36 hours, pitch to real startup judges at T-Hub, IIIT-H, and JNTU. Big prizes and zero fluff.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-rule/60 flex items-center justify-between text-xs font-semibold text-navy-900 group-hover:text-emerald-600">
            <span>Explore Hackathons</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* Track 2: Meetups & Workshops */}
        <Link
          href="/events?type=meetup"
          className="group relative bg-paper border border-rule hover:border-navy-900/40 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-navy-900">
                PRACTICAL LEARNING
              </span>
              <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-rule/50 text-navy-900">
                {meetupsCount} open now
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-navy-900 group-hover:text-emerald transition-colors leading-tight">
              Meetups & Hands-on Workshops
            </h3>
            <p className="mt-3 text-sm font-sans text-slate leading-relaxed">
              Weekend sessions in Hitec City and Gachibowli. Master modern stacks, discuss system architecture, and meet Hyderabad developers.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-rule/60 flex items-center justify-between text-xs font-sans font-semibold text-navy-900">
            <span>Browse Meetups & Workshops</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
