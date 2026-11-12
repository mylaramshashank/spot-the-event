"use client";

import React, { useEffect } from "react";
import { FilterOptions, EventType } from "@/types";

interface EventFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  matchCount: number;
}

export function EventFilterBottomSheet({
  isOpen,
  onClose,
  filters,
  setFilters,
  matchCount,
}: EventFilterBottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const eventTypes: { label: string; value: "all" | EventType }[] = [
    { label: "All types", value: "all" },
    { label: "Hackathons", value: "hackathon" },
    { label: "Meetups", value: "meetup" },
    { label: "Workshops", value: "workshop" },
    { label: "Conferences", value: "conference" },
  ];

  const whenOptions: { label: string; value: FilterOptions["when"] }[] = [
    { label: "All dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "This week", value: "this_week" },
    { label: "This month", value: "this_month" },
  ];

  const costOptions: { label: string; value: FilterOptions["cost"] }[] = [
    { label: "All costs", value: "all" },
    { label: "Free only", value: "free" },
    { label: "Paid", value: "paid" },
  ];

  const modeOptions: { label: string; value: FilterOptions["mode"] }[] = [
    { label: "All modes", value: "all" },
    { label: "In person", value: "in_person" },
    { label: "Online", value: "online" },
  ];

  const sortOptions: { label: string; value: FilterOptions["sortBy"] }[] = [
    { label: "Soonest first", value: "soonest" },
    { label: "Closing soon", value: "closing_soon" },
    { label: "Recently added", value: "recently_added" },
  ];

  const handleReset = () => {
    setFilters({
      type: "all",
      when: "all",
      cost: "all",
      mode: "all",
      onlyOpen: false,
      searchQuery: "",
      sortBy: "soonest",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/60 backdrop-blur-[2px]">
      {/* Backdrop tap to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet modal */}
      <div
        className="relative w-full max-w-lg bg-offwhite border-t border-rule rounded-t-xl max-h-[85vh] flex flex-col z-10 shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
      >
        {/* Drag handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-2 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-rule" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-rule">
          <h3 className="font-display text-xl font-semibold text-navy-900">Filter & Sort Events</h3>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-sans font-medium text-slate hover:text-navy-900"
          >
            Reset all
          </button>
        </div>

        {/* Filter Groups Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Event Type */}
          <div>
            <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate mb-2">
              Event Type
            </span>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, type: item.value }))}
                  className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors ${
                    filters.type === item.value
                      ? "bg-navy-900 text-offwhite border border-navy-900"
                      : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* When */}
          <div>
            <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate mb-2">
              Timeline
            </span>
            <div className="flex flex-wrap gap-2">
              {whenOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, when: item.value }))}
                  className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors ${
                    filters.when === item.value
                      ? "bg-navy-900 text-offwhite border border-navy-900"
                      : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost & Mode Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate mb-2">
                Cost
              </span>
              <div className="flex flex-col gap-1.5">
                {costOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, cost: item.value }))}
                    className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium text-left transition-colors ${
                      filters.cost === item.value
                        ? "bg-navy-900 text-offwhite border border-navy-900"
                        : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate mb-2">
                Location Mode
              </span>
              <div className="flex flex-col gap-1.5">
                {modeOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, mode: item.value }))}
                    className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium text-left transition-colors ${
                      filters.mode === item.value
                        ? "bg-navy-900 text-offwhite border border-navy-900"
                        : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <span className="block text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-slate mb-2">
              Sort By
            </span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, sortBy: item.value }))}
                  className={`px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors ${
                    filters.sortBy === item.value
                      ? "bg-navy-900 text-offwhite border border-navy-900"
                      : "bg-paper border border-rule text-navy-900 hover:border-navy-900/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Registration status toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyOpen}
                onChange={(e) => setFilters((prev) => ({ ...prev, onlyOpen: e.target.checked }))}
                className="w-4 h-4 rounded border-rule text-emerald focus:ring-emerald"
              />
              <span className="text-xs font-sans font-medium text-navy-900">
                Show only events with open registrations
              </span>
            </label>
          </div>
        </div>

        {/* Sheet Footer CTA */}
        <div className="p-4 border-t border-rule bg-offwhite">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-sm bg-navy-900 text-offwhite font-sans font-semibold text-sm hover:bg-navy-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Apply Filters ({matchCount} {matchCount === 1 ? "event" : "events"})
          </button>
        </div>
      </div>
    </div>
  );
}
