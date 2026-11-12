"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VenlixLogo } from "../common/VenlixLogo";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/community", label: "Channel" },
  { href: "/suggest", label: "Suggest" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const onHome = pathname === "/";
  const light = onHome && !isScrolled && !mobileMenuOpen;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:h-16 sm:px-6 lg:px-8",
            isScrolled || mobileMenuOpen
              ? "border-b border-line/80 bg-chalk/95 backdrop-blur-md"
              : "bg-transparent"
          )}
        >
          <Link
            href="/"
            className="shrink-0 transition hover:opacity-90 active:scale-[0.98]"
          >
            <VenlixLogo variant="header" size={22} inverted={light} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition",
                    light
                      ? active
                        ? "bg-white/12 text-white"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                      : active
                        ? "bg-ink text-white"
                        : "text-mist hover:bg-surface hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.curator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("instagram", undefined, "header_instagram")}
              className={cn(
                "hidden h-9 items-center rounded-md px-3 text-xs font-semibold transition sm:inline-flex",
                light
                  ? "border border-white/25 text-white hover:bg-white/10"
                  : "border border-line text-ink hover:bg-surface"
              )}
            >
              Instagram
            </a>
            <Link
              href="/events"
              className={cn(
                "hidden h-9 items-center rounded-md px-3 text-xs font-semibold transition sm:inline-flex",
                light
                  ? "bg-signal text-white hover:bg-signal-dark"
                  : "bg-ink text-white hover:bg-ink-soft"
              )}
            >
              Find event
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden",
                light
                  ? "border-white/25 text-white"
                  : "border-line bg-paper text-ink"
              )}
            >
              <span className="sr-only">Menu</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="h-14 sm:h-16" />

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-line bg-chalk px-4 py-4 shadow-lift sm:top-16 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-semibold",
                    active ? "bg-ink text-white" : "text-ink hover:bg-surface"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              <Link href="/saved" className="flex-1 rounded-md border border-line px-3 py-2.5 text-center text-sm font-semibold">
                Saved
              </Link>
              <Link href="/about" className="flex-1 rounded-md border border-line px-3 py-2.5 text-center text-sm font-semibold">
                About
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
