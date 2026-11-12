"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { ThisWeekSection } from "@/components/home/ThisWeekSection";
import { PickTrackSection } from "@/components/home/PickTrackSection";
import { FromReelsSection } from "@/components/home/FromReelsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { JoinChannelSection } from "@/components/home/JoinChannelSection";
import { SuggestSection } from "@/components/home/SuggestSection";
import { VenlixStrip } from "@/components/home/VenlixStrip";
import { getEvents } from "@/lib/storage";
import { EventItem } from "@/types";
import { getEventStatus } from "@/lib/utils";

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = getEvents().filter((e) => e.status === "published");
    setEvents(list);
    setReady(true);
  }, []);

  const upcoming = events
    .filter((e) => getEventStatus(e) !== "ended")
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

  return (
    <div className="w-full">
      <Hero />
      <ThisWeekSection events={ready ? upcoming : []} loading={!ready} />
      <PickTrackSection events={events} />
      <FromReelsSection events={events} />
      <HowItWorksSection />
      <JoinChannelSection />
      <SuggestSection />
      <VenlixStrip />
    </div>
  );
}
