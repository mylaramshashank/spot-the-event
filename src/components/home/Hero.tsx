"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { trackClick } from "@/lib/storage";

interface HeroProps {
  openCount: number;
}

/* ── Floating Instagram Profile Card ── */
function InstagramProfileCard() {
  return (
    <a
      href="https://www.instagram.com/buildwithshashankk/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Shashank on Instagram (@buildwithshashankk)"
      className="relative block w-[280px] sm:w-[320px] md:w-[340px] rounded-3xl bg-white border border-rule shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden will-change-transform"
    >
      {/* Instagram gradient accent glow behind the card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 opacity-20 group-hover:opacity-35 blur-md transition-opacity -z-10" />

      {/* The enhanced crisp profile card image */}
      <Image
        src="/instagram-card-enhanced.png"
        alt="Shashank Instagram Profile (@buildwithshashankk)"
        width={872}
        height={898}
        priority
        sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 340px"
        className="w-full h-auto block"
      />
    </a>
  );
}

export function Hero({ openCount }: HeroProps) {
  const handleWhatsApp = () => {
    trackClick("whatsapp", undefined, "hero_hub_whatsapp");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 sm:-mt-20 pt-16 sm:pt-20">
      {/* ── Background ── */}
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-offwhite via-offwhite to-emerald-50/40" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, #0B1530 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft ambient gradient orbs (static for 60fps buttery scrolling) */}
      <div className="absolute top-[15%] left-[10%] w-[320px] h-[320px] rounded-full bg-emerald/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[420px] h-[420px] rounded-full bg-navy-900/[0.035] blur-3xl pointer-events-none" />
      <div className="absolute top-[60%] left-[50%] w-[220px] h-[220px] rounded-full bg-emerald/[0.03] blur-2xl pointer-events-none" />

      {/* Decorative subtle floating shapes */}
      <div className="absolute top-[22%] right-[18%] w-3 h-3 rounded-full border-2 border-emerald/20 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-[30%] left-[8%] w-4 h-4 rounded-sm border-2 border-navy-900/10 rotate-45 pointer-events-none hidden sm:block" />
      <div className="absolute top-[45%] right-[8%] w-2 h-2 rounded-full bg-emerald/30 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-[15%] right-[25%] w-5 h-1 rounded-full bg-navy-900/10 pointer-events-none hidden sm:block" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper/80 backdrop-blur-sm border border-rule shadow-sm text-xs font-semibold text-slate mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75 duration-1000" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
              </span>
              <span>
                Updated today &middot;{" "}
                <strong className="text-navy-900 font-bold">
                  {openCount > 0
                    ? `${openCount} verified ${openCount === 1 ? "event" : "events"} open`
                    : "Featured reel events live"}
                </strong>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-900 leading-[1.08]">
              Every tech event
              <br />
              from the reels,{" "}
              <span className="relative inline-block">
                <span className="text-emerald">in one place.</span>
                <span className="absolute bottom-1 left-0 right-0 h-[6px] bg-emerald/15 rounded-full -z-10" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-slate font-medium max-w-lg leading-relaxed">
              Curated Hyderabad hackathons, AI workshops, and tech meetups with cash prize pools, featured on @buildwithshashankk. Tap, register in 30 seconds, zero noise.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                aria-label="Join Spot the Event WhatsApp Channel"
                className="h-12 px-7 rounded-full bg-emerald text-white text-sm font-semibold tracking-wide hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald/20 inline-flex items-center justify-center gap-2"
              >
                Join WhatsApp Channel &rarr;
              </a>
              <Link
                href="/events"
                aria-label="Explore Hyderabad Tech Events"
                className="h-12 px-7 rounded-full bg-navy-900 text-offwhite text-sm font-semibold tracking-wide hover:bg-navy-800 active:scale-95 transition-all shadow-lg shadow-navy-900/15 inline-flex items-center justify-center"
              >
                Explore Events &rarr;
              </Link>
            </div>

            {/* Trust markers */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate/70">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Verified venues
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Zero spam
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                100% free
              </span>
            </div>
          </div>

          {/* Right: Floating Card */}
          <div className="flex-1 flex justify-center lg:justify-end items-center">
            <InstagramProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
}
