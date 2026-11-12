"use client";

import React from "react";
import { VenlixLogo } from "@/components/common/VenlixLogo";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-signal-dark">
          Behind the board
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Why Spot the Event exists
        </h1>
      </div>

      <div className="mb-12 space-y-4 rounded-xl border border-line bg-paper p-6 text-base leading-relaxed text-ink/90 sm:p-8">
        <p>
          If you follow tech in Hyderabad, you know the loop: watch a reel about a weekend hackathon,
          comment for an AutoDM, get nothing — or a pile of spam.
        </p>
        <p>
          <strong className="font-semibold text-ink">Spot the Event</strong> replaces that friction.
          No bots. No generic 400-event dumps. Only events personally vetted and featured on{" "}
          <a
            href={SITE.curator.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-signal hover:underline"
          >
            {SITE.curator.handle}
          </a>
          .
        </p>
        <p className="pt-2 text-sm text-mist">— {SITE.curator.name}, Co-founder at Venlix</p>
      </div>

      <div className="mb-12 rounded-xl border border-ink-mute bg-ink p-6 text-white sm:p-8">
        <VenlixLogo variant="footer" size={32} />
        <h3 className="mt-4 font-display text-2xl font-bold">Built by Venlix</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          Venlix is a visual-first platform that connects founders and creators with video editors —
          hired on timelines and cuts, not PDF resumes.
        </p>
        <a
          href={SITE.venlix.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("venlix", undefined, "about_page_venlix_link")}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-signal px-5 text-xs font-semibold text-white hover:bg-signal-dark"
        >
          Explore Venlix →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
          <h4 className="font-display text-xl font-bold text-ink">{SITE.curator.name}</h4>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-signal">
            Curator & co-founder
          </p>
          <p className="mb-4 text-xs leading-relaxed text-mist">
            Creator of {SITE.curator.handle}. Vets Hyderabad hackathons and builds student developer community.
          </p>
          <div className="space-y-2 border-t border-line pt-3 text-xs font-medium">
            <a href={SITE.curator.instagram} target="_blank" rel="noopener noreferrer" className="block hover:text-signal">
              Instagram →
            </a>
            <a href={SITE.curator.linkedin} target="_blank" rel="noopener noreferrer" className="block hover:text-signal">
              LinkedIn →
            </a>
            <a href={SITE.curator.github} target="_blank" rel="noopener noreferrer" className="block hover:text-signal">
              GitHub →
            </a>
            <a href={SITE.curator.email} className="block text-signal hover:underline">
              Email
            </a>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
          <h4 className="font-display text-xl font-bold text-ink">Divyend</h4>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-signal">
            Engineering & co-founder
          </p>
          <p className="mb-4 text-xs leading-relaxed text-mist">
            Architecting Venlix platform systems, video pipelines, and editorial web experiences.
          </p>
          <a href={SITE.venlix.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-ink hover:text-signal">
            Venlix platform →
          </a>
        </div>
      </div>
    </div>
  );
}
