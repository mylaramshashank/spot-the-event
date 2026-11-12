"use client";

import React, { useState, useEffect } from "react";
import { EventItem, SuggestionItem, EventType, EventMode, EventStatus } from "@/types";
import {
  getEvents,
  saveEvent,
  deleteEvent,
  getSuggestions,
  updateSuggestionStatus,
  getClickAnalytics,
  generateWeeklyDigest,
} from "@/lib/storage";
import { formatShortDate, sanitizeExternalUrl } from "@/lib/utils";

function formatForDatetimeInput(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const offsetMs = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - offsetMs);
    return local.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"events" | "new_event" | "suggestions" | "digest" | "analytics">("events");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [analytics, setAnalytics] = useState(getClickAnalytics());
  const [digestText, setDigestText] = useState("");
  const [digestCopied, setDigestCopied] = useState(false);

  // Form State for Event Add / Edit
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "hackathon" as EventType,
    start_at: "2026-11-20T09:00",
    end_at: "2026-11-21T18:00",
    venue_name: "T-Hub Phase 2, Madhapur",
    venue_map_url: "https://maps.google.com/?q=T-Hub+Phase+2+Hyderabad",
    city: "Hyderabad",
    mode: "in_person" as EventMode,
    fee_text: "Free",
    is_free: true,
    eligibility: "Open to all engineering students",
    team_size: "2 to 4 members",
    prize: "₹1,00,000 cash pool",
    organizer: "Hyderabad Dev Community",
    register_url: "https://",
    deadline_at: "2026-11-18T23:59",
    reel_url: "",
    reel_code: "",
    description: "",
    featured_note: "",
    verified: true,
    status: "published" as EventStatus,
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const loadData = () => {
    const evts = getEvents();
    setEvents(evts);
    setSuggestions(getSuggestions());
    setAnalytics(getClickAnalytics());
    setDigestText(generateWeeklyDigest(evts));
  };

  useEffect(() => {
    // Check if existing secure session cookie exists
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingAuth(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else {
        setLoginError("Invalid admin access key. Please check your credentials.");
      }
    } catch {
      setLoginError("Connection error while authenticating.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setIsAuthenticated(false);
  };

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: editingEventId ? prev.slug : slug,
    }));
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventItem: EventItem = {
      id: editingEventId || `evt-${Date.now()}`,
      slug: form.slug.trim(),
      title: form.title.trim(),
      type: form.type,
      start_at: new Date(form.start_at).toISOString(),
      end_at: new Date(form.end_at).toISOString(),
      venue_name: form.venue_name.trim(),
      venue_map_url: form.venue_map_url.trim(),
      city: form.city.trim() || "Hyderabad",
      mode: form.mode,
      fee_text: form.fee_text.trim(),
      is_free: form.is_free,
      eligibility: form.eligibility.trim(),
      team_size: form.team_size.trim(),
      prize: form.prize.trim() || undefined,
      organizer: form.organizer.trim(),
      register_url: form.register_url.trim(),
      deadline_at: new Date(form.deadline_at).toISOString(),
      reel_url: form.reel_url.trim() || undefined,
      reel_code: form.reel_code.trim() || undefined,
      description: form.description.trim(),
      featured_note: form.featured_note.trim(),
      verified: form.verified,
      status: form.status,
      created_at: editingEventId ? (events.find((x) => x.id === editingEventId)?.created_at || new Date().toISOString()) : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveEvent(eventItem);
    loadData();
    resetForm();
    setActiveTab("events");
  };

  const resetForm = () => {
    setEditingEventId(null);
    setForm({
      title: "",
      slug: "",
      type: "hackathon",
      start_at: "2026-11-20T09:00",
      end_at: "2026-11-21T18:00",
      venue_name: "T-Hub Phase 2, Madhapur",
      venue_map_url: "https://maps.google.com/?q=T-Hub+Phase+2+Hyderabad",
      city: "Hyderabad",
      mode: "in_person",
      fee_text: "Free",
      is_free: true,
      eligibility: "Open to all engineering students",
      team_size: "2 to 4 members",
      prize: "₹1,00,000 cash pool",
      organizer: "Hyderabad Dev Community",
      register_url: "https://",
      deadline_at: "2026-11-18T23:59",
      reel_url: "",
      reel_code: "",
      description: "",
      featured_note: "",
      verified: true,
      status: "published",
    });
  };

  const handleEdit = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setForm({
      title: evt.title,
      slug: evt.slug,
      type: evt.type,
      start_at: formatForDatetimeInput(evt.start_at),
      end_at: formatForDatetimeInput(evt.end_at),
      venue_name: evt.venue_name,
      venue_map_url: evt.venue_map_url || "",
      city: evt.city,
      mode: evt.mode,
      fee_text: evt.fee_text,
      is_free: evt.is_free,
      eligibility: evt.eligibility,
      team_size: evt.team_size,
      prize: evt.prize || "",
      organizer: evt.organizer,
      register_url: evt.register_url,
      deadline_at: formatForDatetimeInput(evt.deadline_at),
      reel_url: evt.reel_url || "",
      reel_code: evt.reel_code || "",
      description: evt.description,
      featured_note: evt.featured_note,
      verified: evt.verified,
      status: evt.status,
    });
    setActiveTab("new_event");
  };

  const handleDuplicate = (evt: EventItem) => {
    const duplicated: EventItem = {
      ...evt,
      id: `evt-${Date.now()}`,
      slug: `${evt.slug}-copy`,
      title: `${evt.title} (Copy)`,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveEvent(duplicated);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this event from the board?")) {
      deleteEvent(id);
      loadData();
    }
  };

  const handleToggleStatus = (evt: EventItem) => {
    const newStatus: EventStatus = evt.status === "published" ? "hidden" : "published";
    saveEvent({ ...evt, status: newStatus });
    loadData();
  };

  const handleApproveSuggestion = (sug: SuggestionItem) => {
    updateSuggestionStatus(sug.id, "approved");
    // Pre-populate form
    setEditingEventId(null);
    const isFree = sug.is_free !== false;
    setForm((prev) => ({
      ...prev,
      title: sug.name,
      slug: sug.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
      register_url: sug.url,
      organizer: sug.organizer || sug.college || "Organized via community",
      is_free: isFree,
      fee_text: !isFree ? (sug.price || "Paid") : "Free entry",
      status: "draft",
    }));
    loadData();
    setActiveTab("new_event");
  };

  const handleCopyDigest = () => {
    navigator.clipboard.writeText(digestText);
    setDigestCopied(true);
    setTimeout(() => setDigestCopied(false), 2000);
  };

  // Loading session check
  if (isLoadingAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-xs font-sans text-slate">Verifying admin session...</p>
      </div>
    );
  }

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-paper border border-rule p-6 sm:p-8 rounded-sm">
          <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald block mb-1">
            VENLIX INTERNAL
          </span>
          <h1 className="font-display text-3xl font-semibold text-navy-900 mb-2">
            Spot the Event Admin
          </h1>
          <p className="text-xs font-sans text-slate mb-6">
            Private management console for Shashank and Divyend.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-xs font-sans font-medium rounded-sm">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (e.g. venlix)"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-navy-900 text-offwhite text-sm font-sans font-semibold rounded-sm hover:bg-navy-700 active:scale-95 transition-all"
            >
              Sign In to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-rule">
        <div>
          <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald block mb-1">
            VENLIX ADMIN CONSOLE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900">
            Spot the Event Control
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab("new_event");
            }}
            className="h-10 px-4 bg-emerald text-offwhite text-xs font-sans font-semibold rounded-sm hover:bg-emerald/90 transition-colors"
          >
            + New Event
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 px-3 bg-paper border border-rule text-slate text-xs font-sans font-semibold rounded-sm hover:text-navy-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-rule pb-2 mb-6 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors whitespace-nowrap ${
            activeTab === "events" ? "bg-navy-900 text-offwhite" : "text-slate hover:text-navy-900"
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("new_event")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors whitespace-nowrap ${
            activeTab === "new_event" ? "bg-navy-900 text-offwhite" : "text-slate hover:text-navy-900"
          }`}
        >
          {editingEventId ? "Edit Event" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors whitespace-nowrap ${
            activeTab === "suggestions" ? "bg-navy-900 text-offwhite" : "text-slate hover:text-navy-900"
          }`}
        >
          Suggestions Queue ({suggestions.filter((s) => s.status === "pending").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("digest")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors whitespace-nowrap ${
            activeTab === "digest" ? "bg-navy-900 text-offwhite" : "text-slate hover:text-navy-900"
          }`}
        >
          WhatsApp Digest Generator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors whitespace-nowrap ${
            activeTab === "analytics" ? "bg-navy-900 text-offwhite" : "text-slate hover:text-navy-900"
          }`}
        >
          Click Analytics ({analytics.totalClicks})
        </button>
      </div>

      {/* TAB 1: EVENTS LIST */}
      {activeTab === "events" && (
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-paper border border-rule p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase ${
                      evt.status === "published"
                        ? "bg-emerald-100 text-emerald"
                        : "bg-rule text-slate"
                    }`}
                  >
                    {evt.status}
                  </span>
                  <span className="text-xs text-slate font-sans">
                    {formatShortDate(evt.start_at)} · {evt.type}
                  </span>
                  {evt.reel_code && (
                    <span className="text-xs text-navy-900 font-semibold font-mono">
                      /r/{evt.reel_code}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-navy-900">
                  {evt.title}
                </h3>
                <p className="text-xs font-sans text-slate">
                  {evt.venue_name} · {evt.fee_text}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-rule">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(evt)}
                  className="px-2.5 py-1 text-xs font-sans font-medium bg-offwhite border border-rule hover:border-navy-900 rounded-sm"
                >
                  {evt.status === "published" ? "Hide" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(evt)}
                  className="px-2.5 py-1 text-xs font-sans font-medium bg-offwhite border border-rule hover:border-navy-900 rounded-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(evt)}
                  className="px-2.5 py-1 text-xs font-sans font-medium bg-offwhite border border-rule hover:border-navy-900 rounded-sm"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(evt.id)}
                  className="px-2.5 py-1 text-xs font-sans font-medium text-rust bg-rust/10 border border-rust/20 rounded-sm hover:bg-rust hover:text-offwhite transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CREATE / EDIT EVENT FORM */}
      {activeTab === "new_event" && (
        <form onSubmit={handleSaveEvent} className="bg-paper border border-rule p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-rule">
            <h2 className="font-display text-2xl font-semibold text-navy-900">
              {editingEventId ? "Edit Event Details" : "Add New Event (Under 60 Seconds)"}
            </h2>
            {editingEventId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-sans text-slate hover:text-navy-900 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Build Hyderabad Hackathon 2026"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Slug (URL identifier) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Short Reel Code (e.g. 42 for /r/42)
              </label>
              <input
                type="text"
                value={form.reel_code}
                onChange={(e) => setForm({ ...form, reel_code: e.target.value })}
                placeholder="e.g. 07"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Event Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              >
                <option value="hackathon">Hackathon</option>
                <option value="meetup">Meetup</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Mode
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value as EventMode })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              >
                <option value="in_person">In Person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={form.start_at}
                onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={form.deadline_at}
                onChange={(e) => setForm({ ...form, deadline_at: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={form.venue_name}
                onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                placeholder="e.g. T-Hub Phase 2, Madhapur, Hyderabad"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Registration URL *
              </label>
              <input
                type="url"
                required
                value={form.register_url}
                onChange={(e) => setForm({ ...form, register_url: e.target.value })}
                placeholder="https://..."
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Instagram Reel URL
              </label>
              <input
                type="url"
                value={form.reel_url}
                onChange={(e) => setForm({ ...form, reel_url: e.target.value })}
                placeholder="https://instagram.com/reel/..."
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Fee Text
              </label>
              <input
                type="text"
                value={form.fee_text}
                onChange={(e) => setForm({ ...form, fee_text: e.target.value })}
                placeholder="Free or ₹499"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Prize Pool
              </label>
              <input
                type="text"
                value={form.prize}
                onChange={(e) => setForm({ ...form, prize: e.target.value })}
                placeholder="e.g. ₹2,00,000 cash pool"
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Organizer
              </label>
              <input
                type="text"
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Publish Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              >
                <option value="published">Published (Visible to public)</option>
                <option value="draft">Draft (Private)</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                &ldquo;Why I featured this&rdquo; Note (Shashank’s Voice)
              </label>
              <input
                type="text"
                value={form.featured_note}
                onChange={(e) => setForm({ ...form, featured_note: e.target.value })}
                placeholder="One personal sentence on why this is worth their weekend..."
                className="w-full h-11 px-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-semibold uppercase tracking-eyebrow text-navy-900 mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Event summary, schedule, and team requirements..."
                className="w-full p-4 bg-offwhite border border-rule text-navy-900 text-sm font-sans rounded-sm focus:ring-2 focus:ring-emerald focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-rule">
            <button
              type="button"
              onClick={resetForm}
              className="h-11 px-5 border border-rule rounded-sm text-xs font-sans font-semibold text-slate hover:text-navy-900"
            >
              Reset
            </button>
            <button
              type="submit"
              className="h-11 px-6 bg-navy-900 text-offwhite rounded-sm text-xs font-sans font-semibold hover:bg-navy-700 active:scale-95 transition-all"
            >
              {editingEventId ? "Save Changes" : "Publish Event"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SUGGESTIONS QUEUE */}
      {activeTab === "suggestions" && (
        <div className="space-y-4">
          <p className="text-xs font-sans text-slate">
            Community submissions submitted via /suggest. Review and approve into a draft event.
          </p>

          {suggestions.length === 0 ? (
            <div className="p-8 bg-paper border border-rule rounded-sm text-center text-sm font-sans text-slate">
              No suggestions in the queue.
            </div>
          ) : (
            suggestions.map((sug) => (
              <div
                key={sug.id}
                className="bg-paper border border-rule p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase ${
                        sug.status === "pending"
                          ? "bg-rust/10 text-rust"
                          : sug.status === "approved"
                          ? "bg-emerald-100 text-emerald"
                          : "bg-rule text-slate"
                      }`}
                    >
                      {sug.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase ${
                        sug.is_free === false
                          ? "bg-rust/10 text-rust"
                          : "bg-emerald-100 text-emerald"
                      }`}
                    >
                      {sug.is_free === false ? `Paid: ${sug.price || "Fee required"}` : "Free"}
                    </span>
                    <span className="text-xs font-sans text-slate">
                      {new Date(sug.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-navy-900">
                    {sug.name}
                  </h4>
                  <p className="text-xs font-sans text-slate mt-0.5">
                    Organizer: {sug.organizer} {sug.college && `· College: ${sug.college}`}
                  </p>
                  <a
                    href={sanitizeExternalUrl(sug.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald underline mt-1 inline-block"
                  >
                    {sug.url}
                  </a>
                </div>

                {sug.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproveSuggestion(sug)}
                      className="px-3 py-1.5 bg-emerald text-offwhite text-xs font-sans font-semibold rounded-sm hover:bg-emerald/90"
                    >
                      Approve to Draft &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateSuggestionStatus(sug.id, "rejected");
                        loadData();
                      }}
                      className="px-3 py-1.5 bg-paper border border-rule text-slate text-xs font-sans font-medium rounded-sm hover:text-navy-900"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SUNDAY WHATSAPP DIGEST GENERATOR */}
      {activeTab === "digest" && (
        <div className="bg-paper border border-rule p-6 sm:p-8 rounded-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-rule">
            <div>
              <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald block mb-1">
                ONE-CLICK BROADCAST COPY
              </span>
              <h3 className="font-display text-2xl font-semibold text-navy-900">
                Sunday WhatsApp Message Generator
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopyDigest}
              className="h-10 px-4 bg-emerald text-offwhite text-xs font-sans font-semibold rounded-sm hover:bg-emerald/90 active:scale-95 transition-all"
            >
              {digestCopied ? "Copied to Clipboard!" : "Copy WhatsApp Message"}
            </button>
          </div>

          <p className="text-xs font-sans text-slate mb-4">
            Generated automatically from all published upcoming events. Formatted with emojis, clean line breaks, and direct tracking links.
          </p>

          <textarea
            readOnly
            rows={14}
            value={digestText}
            className="w-full p-4 bg-offwhite border border-rule text-navy-900 font-mono text-xs sm:text-sm rounded-sm leading-relaxed"
          />
        </div>
      )}

      {/* TAB 5: CLICK ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-paper border border-rule p-4 rounded-sm">
              <span className="text-slate text-xs font-sans">Total Tracked Clicks</span>
              <div className="font-display text-3xl font-semibold text-navy-900 mt-1">
                {analytics.totalClicks}
              </div>
            </div>
            <div className="bg-paper border border-rule p-4 rounded-sm">
              <span className="text-slate text-xs font-sans">Register Button Clicks</span>
              <div className="font-display text-3xl font-semibold text-emerald mt-1">
                {analytics.byKind.register}
              </div>
            </div>
            <div className="bg-paper border border-rule p-4 rounded-sm">
              <span className="text-slate text-xs font-sans">WhatsApp Channel Joins</span>
              <div className="font-display text-3xl font-semibold text-navy-900 mt-1">
                {analytics.byKind.whatsapp}
              </div>
            </div>
            <div className="bg-paper border border-rule p-4 rounded-sm">
              <span className="text-slate text-xs font-sans">Venlix Platform Visits</span>
              <div className="font-display text-3xl font-semibold text-navy-700 mt-1">
                {analytics.byKind.venlix}
              </div>
            </div>
          </div>

          <div className="bg-paper border border-rule p-6 rounded-sm">
            <h3 className="font-display text-xl font-semibold text-navy-900 mb-4 pb-2 border-b border-rule">
              Top Events by Register Clicks
            </h3>
            {analytics.topEvents.length === 0 ? (
              <p className="text-xs font-sans text-slate">No registrations recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {analytics.topEvents.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-rule/50 text-xs font-sans"
                  >
                    <span className="font-medium text-navy-900">
                      {idx + 1}. {item.title}
                    </span>
                    <span className="font-semibold text-emerald bg-emerald-100 px-2 py-0.5 rounded">
                      {item.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
