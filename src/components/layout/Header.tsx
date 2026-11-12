"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VenlixLogo } from "../common/VenlixLogo";
import { trackClick } from "@/lib/storage";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/hackathons", label: "Hackathons", badge: "Hot" },
  { href: "/community", label: "Community" },
  { href: "/suggest", label: "Suggest" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleWhatsApp = () => {
    trackClick("whatsapp", undefined, "header_pill_whatsapp");
  };

  const handleInstagram = () => {
    trackClick("instagram", undefined, "header_pill_instagram");
  };

  return (
    <>
      {/* Floating Centered Curved Nav Bar */}
      <header
        className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none transition-all duration-200"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-rule/90 bg-paper/95 backdrop-blur-md transition-all duration-300 ${
            isScrolled
              ? "shadow-lg shadow-navy-900/10 border-navy-900/15"
              : "shadow-sm shadow-navy-900/5"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 active:scale-95 transition-transform shrink-0 pr-1 sm:pr-2"
          >
            <VenlixLogo variant="header" size={24} />
          </Link>

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-rule hidden sm:block" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? "text-navy-900 bg-surface font-bold shadow-xs"
                      : "text-slate hover:text-navy-900 hover:bg-surface/60"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-rule hidden sm:block" />

          {/* Social Nav Action Buttons: Instagram & WhatsApp */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="https://instagram.com/buildwithshashankk"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagram}
              title="Follow @buildwithshashankk on Instagram"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full border border-rule text-navy-900 text-xs font-semibold hover:bg-surface active:scale-95 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-navy-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="hidden xs:inline">Instagram</span>
            </a>

            <a
              href="https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 h-8 px-3 sm:px-3.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-full border border-rule bg-paper text-navy-900 hover:bg-surface active:scale-95 transition-all"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push content below the floating nav */}
      <div className="h-16 sm:h-20" />

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-40 bg-paper/98 backdrop-blur-md rounded-2xl border border-rule shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-eyebrow uppercase text-slate-500 px-3 py-1">
              Navigation
            </span>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-navy-900 bg-surface font-bold"
                      : "text-slate-600 hover:text-navy-900 hover:bg-surface"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-rule flex items-center justify-between text-xs text-slate-500 px-3">
              <Link href="/saved" onClick={() => setMobileMenuOpen(false)} className="hover:text-navy-900 font-medium">
                Saved Events
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-navy-900 font-medium">
                About Venlix
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
