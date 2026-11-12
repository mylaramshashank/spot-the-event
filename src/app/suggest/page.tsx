"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitSuggestion } from "@/lib/storage";

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    name: "",
    is_free: true,
    price: "",
    url: "",
    date_text: "",
    organizer: "",
    college: "",
    contact: "",
    // Honeypot field for bot protection
    website_hp: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    // Honeypot check
    if (formData.website_hp) {
      setSubmitted(true);
      return;
    }

    const cleanName = formData.name.trim();
    const cleanUrl = formData.url.trim();
    const cleanDate = formData.date_text.trim();
    const cleanOrganizer = formData.organizer.trim() || "Independent / Student body";
    const cleanPrice = formData.price.trim();

    if (cleanName.length < 2 || !cleanUrl || !cleanDate) {
      setError("Please fill out event name, official link, and approximate date.");
      return;
    }

    if (!formData.is_free && !cleanPrice) {
      setError("Please enter the ticket / registration fee or select Free.");
      return;
    }

    try {
      const parsed = new URL(cleanUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Official link must start with https:// or http://.");
        return;
      }
    } catch {
      setError("Please enter a valid registration URL starting with https:// or http://.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          is_free: formData.is_free,
          price: formData.is_free ? "" : cleanPrice,
          url: cleanUrl,
          date_text: cleanDate,
          organizer: cleanOrganizer,
          college: formData.college.trim(),
          contact: formData.contact.trim(),
          website_hp: formData.website_hp,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Could not submit event suggestion. Please check your details and try again.");
        setIsSubmitting(false);
        return;
      }

      submitSuggestion({
        name: cleanName,
        url: cleanUrl,
        date_text: cleanDate,
        organizer: cleanOrganizer,
        college: formData.college.trim(),
        contact: formData.contact.trim(),
      });

      setSubmitted(true);
    } catch {
      setError("Network error while submitting. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              maxLength={120}
              placeholder="e.g. Hyderabad Web3 Summer Hackathon"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
            />
          </div>

          {/* Entry Fee Toggle: Free vs Paid */}
          <div>
            <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
              Entry Fee *
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_free: true, price: "" })}
                className={`h-10 px-4 rounded-sm text-xs font-sans font-semibold border transition-colors ${
                  formData.is_free
                    ? "bg-emerald text-white border-emerald"
                    : "bg-offwhite text-navy-900 border-rule hover:border-navy-900/40"
                }`}
              >
                Free Event
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_free: false })}
                className={`h-10 px-4 rounded-sm text-xs font-sans font-semibold border transition-colors ${
                  !formData.is_free
                    ? "bg-navy-900 text-offwhite border-navy-900"
                    : "bg-offwhite text-navy-900 border-rule hover:border-navy-900/40"
                }`}
              >
                Paid Ticket
              </button>

              {!formData.is_free && (
                <input
                  type="text"
                  required
                  maxLength={60}
                  placeholder="e.g. ₹299 per person"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="flex-1 min-w-[180px] h-10 px-4 bg-offwhite border border-rule text-navy-900 placeholder:text-slate/60 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900 mb-1.5">
              Registration or Official Link *
            </label>
            <input
              type="url"
              required
              maxLength={500}
              placeholder="https://unstop.com/... or https://lu.ma/..."
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
                maxLength={100}
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
                maxLength={100}
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
                maxLength={120}
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
                maxLength={120}
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
              disabled={isSubmitting}
              className="w-full h-12 bg-navy-900 text-offwhite font-sans font-semibold text-sm rounded-sm hover:bg-navy-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit for Review \u2192"}
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
