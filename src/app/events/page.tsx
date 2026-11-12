"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FilterOptions, EventItem, EventType } from "@/types";
import { getEvents, trackClick } from "@/lib/storage";
import { EventCardRow } from "@/components/events/EventCardRow";
import { EventFilterBottomSheet } from "@/components/events/EventFilterBottomSheet";
import { groupEventsByWeek, getEventStatus } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { VenlixPixelLoader } from "@/components/common/VenlixLogo";

function EventsPageContent() {
  const searchParams = useSearchParams();
  const initialType = (searchParams?.get("type") as EventType) || "all";

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: initialType === "hackathon" || initialType === "meetup" || initialType === "workshop" || initialType === "conference" ? initialType : "all",
    when: "all",
    cost: "all",
    mode: "all",
    onlyOpen: false,
    searchQuery: searchParams?.get("q") || "",
    sortBy: "soonest",
  });

  useEffect(() => {
    setAllEvents(getEvents());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const q = searchParams?.get("q");
    const type = searchParams?.get("type") as EventType | null;
    setFilters((prev) => ({
      ...prev,
      searchQuery: q ?? prev.searchQuery,
      type:
        type === "hackathon" || type === "meetup" || type === "workshop" || type === "conference"
          ? type
          : prev.type,
    }));
  }, [searchParams]);

  const filteredEvents = useMemo(() => {
    let list = allEvents.filter((e) => e.status === "published");

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") list = list.filter((e) => e.type === filters.type);
    if (filters.cost === "free") list = list.filter((e) => e.is_free);
    if (filters.cost === "paid") list = list.filter((e) => !e.is_free);
    if (filters.mode !== "all") list = list.filter((e) => e.mode === filters.mode);
    if (filters.onlyOpen) list = list.filter((e) => getEventStatus(e) !== "ended");

    if (filters.when !== "all") {
      const now = new Date();
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      if (filters.when === "today") list = list.filter((e) => new Date(e.start_at) <= endOfToday);
      else if (filters.when === "this_week") list = list.filter((e) => new Date(e.start_at) <= endOfWeek);
      else if (filters.when === "this_month") list = list.filter((e) => new Date(e.start_at) <= endOfMonth);
    }

    list.sort((a, b) => {
      if (filters.sortBy === "closing_soon") {
        return new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime();
      }
      if (filters.sortBy === "recently_added") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    });

    return list;
  }, [allEvents, filters]);

  const grouped = useMemo(() => groupEventsByWeek(filteredEvents), [filteredEvents]);

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
          Curated board
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          All Hyderabad events
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mist sm:text-base">
          Search the event from the reel, filter by type or date, then open the official registration link.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <input
            id="event-search"
            type="search"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search title, venue, college…"
            className="h-11 w-full rounded-md border border-line bg-paper px-4 pr-16 text-sm text-ink placeholder:text-mist-soft focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
          />
          {filters.searchQuery ? (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-mist hover:text-ink"
            >
              Clear
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-chalk px-1.5 py-0.5 text-[10px] text-mist sm:inline">
              /
            </kbd>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-ink/30"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-signal text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:px-0">
        {typeChips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, type: chip.value }))}
            className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              filters.type === chip.value
                ? "bg-ink text-white"
                : "border border-line bg-paper text-ink hover:border-ink/30"
            }`}
          >
            {chip.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            setFilters((prev) => ({ ...prev, cost: prev.cost === "free" ? "all" : "free" }))
          }
          className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold ${
            filters.cost === "free" ? "bg-signal text-white" : "border border-line bg-paper text-ink"
          }`}
        >
          Free only
        </button>
        <button
          type="button"
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              sortBy: prev.sortBy === "closing_soon" ? "soonest" : "closing_soon",
            }))
          }
          className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold ${
            filters.sortBy === "closing_soon"
              ? "bg-alert text-white"
              : "border border-line bg-paper text-ink"
          }`}
        >
          Closing soon
        </button>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-20">
          <VenlixPixelLoader />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="mx-auto my-16 max-w-lg rounded-xl border border-line bg-paper px-8 py-10 text-center">
          <p className="font-display text-2xl font-bold text-ink">Nothing matched.</p>
          <p className="mt-2 text-sm text-mist">
            Try a shorter keyword from the reel, clear filters, or join the channel for the next drop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFilters({
                  type: "all",
                  when: "all",
                  cost: "all",
                  mode: "all",
                  onlyOpen: false,
                  searchQuery: "",
                  sortBy: "soonest",
                })
              }
              className="h-11 rounded-md bg-ink px-5 text-sm font-semibold text-white"
            >
              Reset filters
            </button>
            <a
              href={SITE.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("whatsapp", undefined, "empty_state_whatsapp")}
              className="h-11 rounded-md border border-line px-5 text-sm font-semibold leading-[2.75rem] text-ink"
            >
              Join channel
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-2 space-y-8">
          {Object.entries(grouped).map(([groupTitle, list]) => (
            <div key={groupTitle}>
              <div className="sticky top-14 z-20 mb-4 flex items-center justify-between border-b border-line bg-chalk/95 py-2.5 backdrop-blur-sm sm:top-16">
                <span className="text-xs font-semibold uppercase tracking-eyebrow text-ink">
                  {groupTitle}
                </span>
                <span className="text-xs text-mist">
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
        <div className="flex justify-center py-20">
          <VenlixPixelLoader />
        </div>
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}
