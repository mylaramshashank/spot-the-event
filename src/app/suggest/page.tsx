"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitSuggestion } from "@/lib/storage";

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    date_text: "",
    organizer: "",
    college: "",
    contact: "",
    // Honeypot field for bot protection
    website_hp: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot check
    if (formData.website_hp) {
      // Silently ignore bot submission
      setSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.url.trim() || !formData.date_text.trim()) {
      setError("Please fill out event name, official link, and approximate date.");
      return;
    }

    submitSuggestion({
      name: formData.name.trim(),
      url: formData.url.trim(),
      date_text: formData.date_text.trim(),
      organizer: formData.organizer.trim() || "Independent / Student body",
      college: formData.college.trim(),
      contact: formData.contact.trim(),
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs font-sans font-semibold text-slate hover:text-navy-900 inline-flex items-center gap-1.5 transition-colors"
        >
          &larr; Back to home
        </Link>
      </div>

      <div className="mb-8">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
          COMMUNITY SUBMISSION
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
          Suggest an Event
        </h1>
        <p className="mt-3 text-base text-slate leading-relaxed">
          Hosting an offline tech meetup or college hackathon in Hyderabad? Share the details. Every submission is personally vetted before being featured in the reels.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 bg-paper border border-rule rounded-3xl text-center shadow-md">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">
            Got it. If it fits, it will be in the next reel.
          </h2>
          <p className="text-sm text-slate max-w-md mx-auto mb-6">
            We review the syllabus, venue legitimacy, and registration safety. No promises, but if it offers genuine value to Hyderabad students, you’ll see it on @buildwithshashankk.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-navy-900 text-offwhite text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            Explore open events &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-paper border border-rule p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Honeypot field (hidden from humans) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_hp">Leave empty</label>
            <input
              id="website_hp"
              type="text"
              value={formData.website_hp}
              onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
              Event Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hyderabad Web3 Summer Hackathon"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
              Registration or Official Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://unstop.com/..., https://lu.ma/..., or devfolio.co"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
                Dates / Timeline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 25-26 Nov 2026"
                value={formData.date_text}
                onChange={(e) => setFormData({ ...formData, date_text: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
                Organizer or Club
              </label>
              <input
                type="text"
                placeholder="e.g. IEEE CBIT / DevCircle"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
                Your College / Campus (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. VNR VJIET / Mahindra Univ"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
                WhatsApp / Email (for confirmation)
              </label>
              <input
                type="text"
                placeholder="Optional, kept 100% private"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-navy-900 text-offwhite font-sans font-semibold text-sm rounded-sm hover:bg-navy-700 active:scale-[0.98] transition-all"
            >
              Submit for Review &rarr;
            </button>
            <p className="mt-2 text-center text-xs font-sans text-slate">
              Submissions go straight to the private editorial queue. No spam, no public listing without review.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
