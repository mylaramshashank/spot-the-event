"use client";

import React from "react";
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

export default function HomePage() {
  const { events } = useLiveEvents();

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
