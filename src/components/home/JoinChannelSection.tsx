"use client";

import React from "react";
import { trackClick } from "@/lib/storage";

export function JoinChannelSection() {
  const handleJoin = () => {
    trackClick("whatsapp", undefined, "channel_section_cta");
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="w-full bg-navy-900 text-offwhite p-6 sm:p-10 rounded-3xl border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-100 block mb-2">
            05 / JOIN THE CHANNEL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-offwhite tracking-tight leading-tight">
            Get the week’s events on WhatsApp. No chatter.
          </h2>
          <p className="mt-4 text-sm text-offwhite/80 leading-relaxed">
            Curated Hyderabad lineup, verified registration links, and closing-soon alerts. Members’ phone numbers are completely private.
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-offwhite/90">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
              <span>Direct registration links before reels air</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
              <span>48-hour deadline radar for closing hackathons</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
              <span>Zero member chatter, zero promotional spam</span>
            </li>
          </ul>
        </div>

        <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
          <a
            href="https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoin}
            className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-emerald text-white font-semibold text-sm tracking-wide hover:bg-emerald-600 active:scale-95 transition-all shadow-md w-full sm:w-auto text-center"
          >
            Join WhatsApp Channel &rarr;
          </a>
          <span className="text-[11px] text-offwhite/60">
            Free · One-way broadcast · 100% private
          </span>
        </div>
      </div>
    </section>
  );
}
