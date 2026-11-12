"use client";

import React from "react";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";

export function JoinChannelSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-ink px-6 py-10 text-white sm:px-10">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-signal/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-signal">
              WhatsApp channel
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get the week’s lineup. No chatter.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Verified registration links and closing-soon alerts. Broadcast only — your number stays private.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href={SITE.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("whatsapp", undefined, "channel_section_cta")}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-signal px-6 text-sm font-semibold text-white transition hover:bg-signal-dark active:scale-[0.98] sm:w-auto"
            >
              Join WhatsApp channel →
            </a>
            <p className="mt-2 text-center text-[11px] text-white/50 sm:text-left">
              Free · one-way broadcast
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
