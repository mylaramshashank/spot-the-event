"use client";

import { useEffect, useState } from "react";
import { EventItem } from "@/types";
import { fetchPublishedEvents, getEvents } from "./storage";

export function useLiveEvents(initial?: EventItem[]): { events: EventItem[]; synced: boolean } {
  const [events, setEvents] = useState<EventItem[]>(
    initial && initial.length > 0 ? initial : []
  );
  const [synced, setSynced] = useState(Boolean(initial && initial.length > 0));

  useEffect(() => {
    let active = true;

    if (!initial || initial.length === 0) {
      setEvents(getEvents());
      fetchPublishedEvents().then((live) => {
        if (!active) return;
        setEvents(live);
        setSynced(true);
      });
    }

    return () => {
      active = false;
    };
  }, [initial]);

  return { events, synced };
}
