"use client";

import { useEffect, useState } from "react";
import { EventItem } from "@/types";
import { fetchPublishedEvents, getEvents } from "./storage";

export function useLiveEvents(): { events: EventItem[]; synced: boolean } {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let active = true;
    setEvents(getEvents());

    fetchPublishedEvents().then((live) => {
      if (!active) return;
      setEvents(live);
      setSynced(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return { events, synced };
}
