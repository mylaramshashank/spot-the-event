"use client";

import React from "react";
import { EventItem } from "@/types";
import { Hero } from "@/components/home/Hero";
import { ThisWeekSection } from "@/components/home/ThisWeekSection";
import { PickTrackSection } from "@/components/home/PickTrackSection";
import { FromReelsSection } from "@/components/home/FromReelsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { JoinChannelSection } from "@/components/home/JoinChannelSection";
import { SuggestSection } from "@/components/home/SuggestSection";
import { VenlixStrip } from "@/components/home/VenlixStrip";
import { useLiveEvents } from "@/lib/useLiveEvents";
import { getEventStatus } from "@/lib/utils";

interface HomePageClientProps {
  initialEvents: EventItem[];
}

export function HomePageClient({ initialEvents }: HomePageClientProps) {
  const { events: liveEvents } = useLiveEvents();
  const events = liveEvents && liveEvents.length > 0 ? liveEvents : initialEvents;

  const openCount = events.filter(
    (e) => e.status === "published" && getEventStatus(e) !== "ended"
  ).length;

  return (
    <div className="w-full">
      <Hero openCount={openCount} />
      <ThisWeekSection events={events} />
      <PickTrackSection events={events} />
      <FromReelsSection events={events} />
      <HowItWorksSection />
      <JoinChannelSection />
      <SuggestSection />
      <VenlixStrip />
    </div>
  );
}
