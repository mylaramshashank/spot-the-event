"use client";

import React from "react";
import Link from "next/link";
import { VenlixLogo } from "../common/VenlixLogo";
import { trackClick } from "@/lib/storage";

export function Footer() {
  const handleOutbound = (kind: "instagram" | "whatsapp" | "venlix", source: string) => {
    trackClick(kind, undefined, source);
  };

  return (
    <footer className="w-full bg-navy-900 text-offwhite border-t border-navy-700 mt-20 pt-14 pb-20 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-navy-700">
          <div className="max-w-sm">
            <VenlixLogo variant="footer" size={30} />
            <p className="mt-4 text-sm font-sans leading-relaxed text-offwhite/70">
              Hyderabad’s tech events, hackathons, meetups and workshops featured in the reels. Direct registrations with zero noise.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-xs font-sans text-offwhite/80">
                Curated by Mylaram Shashank & Divyend Reddy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald mb-3">
                Pages
              </span>
              <ul className="space-y-2 text-offwhite/80 font-sans">
                <li>
                  <Link href="/events" className="hover:text-offwhite transition-colors">
                    All Events
                  </Link>
                </li>
                <li>
                  <Link href="/hackathons" className="hover:text-offwhite transition-colors">
                    Hackathons
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-offwhite transition-colors">
                    WhatsApp Channel
                  </Link>
                </li>
                <li>
                  <Link href="/saved" className="hover:text-offwhite transition-colors">
                    Saved Events
                  </Link>
                </li>
                <li>
                  <Link href="/suggest" className="hover:text-offwhite transition-colors">
                    Suggest an Event
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald mb-3">
                Connect
              </span>
              <ul className="space-y-2 text-offwhite/80 font-sans">
                <li>
                  <a
                    href="https://instagram.com/buildwithshashankk"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOutbound("instagram", "footer_instagram")}
                    className="hover:text-offwhite transition-colors"
                  >
                    Instagram Reel Board
                  </a>
                </li>
                <li>
                  <a
                    href="https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOutbound("whatsapp", "footer_whatsapp")}
                    className="hover:text-offwhite transition-colors"
                  >
                    WhatsApp Channel
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/mylaramshashank/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-offwhite transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mylaramshashank"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-offwhite transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mylaramshashank@gmail.com"
                    className="hover:text-offwhite transition-colors"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <Link href="/about" className="hover:text-offwhite transition-colors">
                    About Venlix
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-offwhite text-offwhite/40 transition-colors">
                    Organizer Admin
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald mb-3">
                Venlix Platform
              </span>
              <p className="text-xs text-offwhite/70 leading-relaxed">
                Spot the Event is built by Venlix, a visual-first way to hire video editors.
              </p>
              <a
                href="https://venlix.tech"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOutbound("venlix", "footer_venlix_link")}
                className="mt-3 inline-flex items-center text-xs font-semibold text-emerald hover:underline"
              >
                Explore Venlix &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-offwhite/50 font-sans gap-4">
          <p>© {new Date().getFullYear()} Spot the Event · Built with care by Venlix</p>
          <p className="tracking-wide">Made in Hyderabad, Telangana</p>
        </div>
      </div>
    </footer>
  );
}
