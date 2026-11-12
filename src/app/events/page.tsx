"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FilterOptions, EventItem, EventType } from "@/types";
import { getEvents, trackClick } from "@/lib/storage";
import { EventCardRow } from "@/components/events/EventCardRow";
import { EventFilterBottomSheet } from "@/components/events/EventFilterBottomSheet";
import { groupEventsByWeek, getEventStatus } from "@/lib/utils";

function EventsPageContent() {
  const searchParams = useSearchParams();
  const initialType = (searchParams?.get("type") as EventType) || "all";

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: initialType,
    when: "all",
    cost: "all",
    mode: "all",
    onlyOpen: false,
    searchQuery: searchParams?.get("q") || "",
    sortBy: "soonest",
  });

  useEffect(() => {
    setAllEvents(getEvents());
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let list = allEvents.filter((e) => e.status === "published");

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type !== "all") {
      list = list.filter((e) => e.type === filters.type);
    }

    // Cost filter
    if (filters.cost === "free") {
      list = list.filter((e) => e.is_free);
    } else if (filters.cost === "paid") {
      list = list.filter((e) => !e.is_free);
    }

    // Mode filter
    if (filters.mode !== "all") {
      list = list.filter((e) => e.mode === filters.mode);
    }

    // Only open
    if (filters.onlyOpen) {
      list = list.filter((e) => getEventStatus(e) !== "ended");
    }

    // When filter
    if (filters.when !== "all") {
      const now = new Date();
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      if (filters.when === "today") {
        list = list.filter((e) => new Date(e.start_at) <= endOfToday);
      } else if (filters.when === "this_week") {
        list = list.filter((e) => new Date(e.start_at) <= endOfWeek);
      } else if (filters.when === "this_month") {
        list = list.filter((e) => new Date(e.start_at) <= endOfMonth);
      }
    }

    // Sorting
    list.sort((a, b) => {
      if (filters.sortBy === "closing_soon") {
        return new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime();
      }
      if (filters.sortBy === "recently_added") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default: soonest
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    });

    return list;
  }, [allEvents, filters]);

  // Group by week
  const grouped = useMemo(() => {
    return groupEventsByWeek(filteredEvents);
  }, [filteredEvents]);

  const activeFilterCount =
    (filters.type !== "all" ? 1 : 0) +
    (filters.when !== "all" ? 1 : 0) +
    (filters.cost !== "all" ? 1 : 0) +
    (filters.mode !== "all" ? 1 : 0) +
    (filters.onlyOpen ? 1 : 0) +
    (filters.sortBy !== "soonest" ? 1 : 0);

  const typeChips: { label: string; value: "all" | EventType }[] = [
    { label: "All", value: "all" },
    { label: "Hackathons", value: "hackathon" },
    { label: "Meetups", value: "meetup" },
    { label: "Workshops", value: "workshop" },
    { label: "Conferences", value: "conference" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-6">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-slate block mb-1">
          CURATED BOARD
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
          All Hyderabad Events
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate">
          Every event featured on the reels, verified with organizers before listing.
        </p>
      </div>

      {/* Search & Mobile Filter Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by title, venue, college..."
            className="w-full h-11 pl-4 pr-10 bg-paper border border-rule text-navy-900 placeholder:text-slate-500/60 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald shadow-xs"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate hover:text-navy-900"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter button - opens Bottom Sheet on mobile */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="h-11 px-4 rounded-full bg-paper border border-rule hover:border-navy-900/40 text-navy-900 text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 active:scale-95 transition-all shadow-xs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald text-white text-[11px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Horizontal Chip row (Quick Type Filter) */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {typeChips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, type: chip.value }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filters.type === chip.value
                ? "bg-navy-900 text-offwhite border border-navy-900 shadow-xs"
                : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
            }`}
          >
            {chip.label}
          </button>
        ))}

        {/* Free toggle chip */}
        <button
          type="button"
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              cost: prev.cost === "free" ? "all" : "free",
            }))
          }
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filters.cost === "free"
              ? "bg-emerald text-white border border-emerald shadow-xs"
              : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
          }`}
        >
          Free only
        </button>

        {/* Sort: Closing soon chip */}
        <button
          type="button"
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              sortBy: prev.sortBy === "closing_soon" ? "soonest" : "closing_soon",
            }))
          }
          className={`px-3.5 py-1.5 rounded-sm text-xs font-sans font-medium whitespace-nowrap transition-colors ${
            filters.sortBy === "closing_soon"
              ? "bg-rust text-offwhite border border-rust"
              : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
          }`}
        >
          Closing soon
        </button>
      </div>

      {/* Event list or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="my-16 p-8 bg-paper border border-rule rounded-sm text-center max-w-lg mx-auto">
          <p className="font-display text-2xl font-semibold text-navy-900 mb-2">
            Nothing open right now.
          </p>
          <p className="text-sm font-sans text-slate mb-6">
            The next one usually lands on Sunday evening. Join the WhatsApp Channel so you never miss a drop.
          </p>
          <a
            href="https://whatsapp.com/channel/0029Vaexample"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("whatsapp", undefined, "empty_state_whatsapp")}
            className="inline-flex items-center justify-center h-11 px-5 rounded-sm bg-emerald text-offwhite font-sans font-semibold text-xs tracking-wide hover:bg-emerald/90 active:scale-95 transition-all"
          >
            Join WhatsApp Channel &rarr;
          </a>
        </div>
      ) : (
        <div className="space-y-8 mt-2">
          {Object.entries(grouped).map(([groupTitle, list]) => (
            <div key={groupTitle}>
              {/* Sticky week header */}
              <div className="sticky top-14 z-20 py-2.5 bg-offwhite/95 backdrop-blur-none border-b border-rule mb-4 flex items-center justify-between">
                <span className="text-xs font-sans font-semibold tracking-eyebrow uppercase text-navy-900">
                  {groupTitle}
                </span>
                <span className="text-xs font-sans text-slate">
                  {list.length} {list.length === 1 ? "event" : "events"}
                </span>
              </div>

              <div className="space-y-3">
                {list.map((evt) => (
                  <EventCardRow key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Bottom Sheet Modal */}
      <EventFilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        matchCount={filteredEvents.length}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xs font-sans text-slate">Loading events board...</p>
        </div>
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}
