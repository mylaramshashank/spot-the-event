"use client";

import React, { useState } from "react";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";

export default function CommunityPage() {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const channelUrl = SITE.whatsappChannel;

  const faqs = [
    {
      q: "Is the WhatsApp Channel free?",
      a: "Yes. Free, no paid tiers.",
    },
    {
      q: "Can others see my phone number?",
      a: "No. WhatsApp Channels are private broadcasts — members and admins cannot see your number.",
    },
    {
      q: "How often do you post?",
      a: "When a curated event is verified, plus occasional closing-soon reminders.",
    },
    {
      q: "Instagram blocked the WhatsApp link?",
      a: "Use Copy Channel Link and paste it into WhatsApp or your browser.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-signal-dark">
          Hyderabad builders
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          The WhatsApp channel
        </h1>
        <p className="mt-3 max-w-2xl text-base text-mist">
          Verified Hyderabad hackathons, meetups, and workshops. Broadcast only — zero member chatter.
        </p>
      </div>

      <div className="relative mb-12 overflow-hidden rounded-2xl bg-ink p-6 text-white sm:p-8">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Get registration links before the reel peaks
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/70">
            Closing-soon alerts and curated drops. Replace the placeholder channel URL in{" "}
            <code className="text-signal">src/lib/site.ts</code> with your real invite when ready.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("whatsapp", undefined, "community_page_join")}
              className="inline-flex h-12 items-center justify-center rounded-md bg-signal px-6 text-sm font-semibold text-white hover:bg-signal-dark"
            >
              Open in WhatsApp →
            </a>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(channelUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-xs font-semibold text-white"
            >
              {copied ? "Link copied" : "Copy channel link"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="mb-6 border-b border-line pb-2 font-display text-2xl font-bold text-ink">
          Frequently asked
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="overflow-hidden rounded-xl border border-line bg-paper">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-ink">{faq.q}</span>
                  <span className="text-mist">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="border-t border-line px-4 pb-4 pt-3 text-sm text-mist sm:px-5">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-paper p-6 text-center sm:p-8">
        <h3 className="font-display text-xl font-bold text-ink">Connect with {SITE.curator.name}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-mist">
          Event collabs, feedback, or Hyderabad builder ecosystem chats.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a href={SITE.curator.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-md bg-ink px-4 py-2.5 text-xs font-semibold text-white">
            LinkedIn
          </a>
          <a href={SITE.curator.github} target="_blank" rel="noopener noreferrer" className="rounded-md bg-ink px-4 py-2.5 text-xs font-semibold text-white">
            GitHub
          </a>
          <a href={SITE.curator.email} className="rounded-md bg-signal px-4 py-2.5 text-xs font-semibold text-white">
            Email
          </a>
          <a href={SITE.curator.instagram} target="_blank" rel="noopener noreferrer" className="rounded-md border border-line px-4 py-2.5 text-xs font-semibold text-ink">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
