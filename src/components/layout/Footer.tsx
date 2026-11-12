"use client";

import React from "react";
import Link from "next/link";
import { VenlixLogo } from "../common/VenlixLogo";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";

export function Footer() {
  const outbound = (kind: "instagram" | "whatsapp" | "venlix", source: string) => {
    trackClick(kind, undefined, source);
  };

  return (
    <footer className="mt-20 border-t border-ink-mute bg-ink pb-20 pt-14 text-white sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 md:flex-row md:items-start">
          <div className="max-w-sm">
            <VenlixLogo variant="footer" size={28} />
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Reel → bio → this board → official registration. Hyderabad hackathons,
              meetups, and workshops without AutoDM noise.
            </p>
            <a
              href={SITE.curator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => outbound("instagram", "footer_instagram")}
              className="mt-5 inline-flex text-sm font-semibold text-signal hover:underline"
            >
              {SITE.curator.handle} on Instagram →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-eyebrow text-signal">
                Browse
              </span>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/events" className="hover:text-white">All events</Link></li>
                <li><Link href="/hackathons" className="hover:text-white">Hackathons</Link></li>
                <li><Link href="/saved" className="hover:text-white">Saved</Link></li>
                <li><Link href="/suggest" className="hover:text-white">Suggest</Link></li>
              </ul>
            </div>
            <div>
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-eyebrow text-signal">
                Connect
              </span>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href={SITE.whatsappChannel} target="_blank" rel="noopener noreferrer" onClick={() => outbound("whatsapp", "footer_whatsapp")} className="hover:text-white">
                    WhatsApp channel
                  </a>
                </li>
                <li>
                  <a href={SITE.curator.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={SITE.curator.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={SITE.curator.email} className="hover:text-white">Email</a>
                </li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/admin" className="text-white/35 hover:text-white/70">Admin</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-eyebrow text-signal">
                Venlix
              </span>
              <p className="text-xs leading-relaxed text-white/60">
                Spot the Event is built by Venlix — a visual-first way to hire video editors.
              </p>
              <a
                href={SITE.venlix.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => outbound("venlix", "footer_venlix")}
                className="mt-3 inline-flex text-xs font-semibold text-signal hover:underline"
              >
                Explore Venlix →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name} · Venlix</p>
          <p>Made in Hyderabad, Telangana</p>
        </div>
      </div>
    </footer>
  );
}
