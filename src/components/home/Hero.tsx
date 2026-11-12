"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/events?q=${encodeURIComponent(q)}` : "/events");
  };

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden -mt-16 sm:-mt-20 pt-16 sm:pt-20">
      {/* Full-bleed atmospheric plane */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#12151C_0%,#1C2230_42%,#243041_72%,#1A3D34_100%)]" />
      <div className="absolute inset-0 bg-grid-ink opacity-[0.12] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-grain opacity-[0.18] mix-blend-overlay" />
      <div className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-signal/20 blur-[110px]" />
      <div className="absolute -right-16 bottom-0 h-[380px] w-[380px] rounded-full bg-[#3D6B8C]/25 blur-[120px]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl grid-cols-1 items-stretch gap-0 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Copy column */}
        <div className="flex flex-col justify-center py-10 sm:py-14 lg:col-span-6 lg:py-20 lg:pr-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-display text-sm font-semibold tracking-[0.08em] text-signal sm:text-base"
          >
            {SITE.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-4 max-w-[14ch] font-display text-[2.55rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.1rem]"
          >
            Find the event from the reel.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 max-w-md text-base leading-relaxed text-white/72 sm:text-lg"
          >
            Hyderabad hackathons, meetups, and workshops — curated from{" "}
            {SITE.curator.handle}. Official registration links. No AutoDM.
          </motion.p>

          <motion.form
            onSubmit={onSearch}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            role="search"
            aria-label="Search events from a reel"
          >
            <label className="relative flex-1">
              <span className="sr-only">Search events</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the event you saw…"
                className="h-12 w-full rounded-md border border-white/15 bg-white/95 px-4 pr-12 text-sm text-ink placeholder:text-mist shadow-lift focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-chalk px-1.5 py-0.5 text-[10px] font-medium text-mist sm:inline">
                /
              </kbd>
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-md bg-signal px-5 text-sm font-semibold text-white transition hover:bg-signal-dark active:scale-[0.98]"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.36 }}
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/25 bg-transparent px-5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
            >
              Browse all events
            </Link>
            <a
              href={SITE.curator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/65 underline-offset-4 transition hover:text-white hover:underline"
            >
              Follow {SITE.curator.handle}
            </a>
          </motion.div>
        </div>

        {/* Dominant visual — full-bleed on large screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:col-span-6 min-h-[42vh] sm:min-h-[48vh] lg:min-h-full"
        >
          <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-t-2xl border border-white/10 sm:top-8 lg:absolute lg:inset-y-0 lg:right-[-2rem] lg:left-0 lg:rounded-none lg:border-y-0 lg:border-l lg:border-r-0 lg:border-white/10">
            <img
              src="/instagram-card-enhanced.png"
              alt="Instagram profile for @buildwithshashankk — Shashank | AI & TECH"
              className="h-full w-full object-cover object-top animate-pan-slow will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/20 lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-ink/35" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
