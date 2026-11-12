import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes external URLs to prevent XSS (e.g. javascript: or data: URIs)
 */
export function sanitizeExternalUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    // invalid URL format
  }
  return "#";
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return isoString;
  }
}

export function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const day = d.toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" });
    const month = d.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase();
    return `${day} ${month}`;
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "";
  }
}

export function getDaysUntil(isoString: string): number {
  const target = new Date(isoString).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export type EventComputedStatus = 'open' | 'closing_soon' | 'ended';

export function getEventStatus(event: EventItem): EventComputedStatus {
  const now = new Date().getTime();
  const deadline = new Date(event.deadline_at).getTime();
  const end = new Date(event.end_at).getTime();

  if (now > end || now > deadline) {
    return 'ended';
  }

  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  if (hoursLeft > 0 && hoursLeft <= 48) {
    return 'closing_soon';
  }

  return 'open';
}

export function getDeadlineLabel(event: EventItem): string {
  const status = getEventStatus(event);
  if (status === 'ended') {
    return 'Registration closed';
  }
  const deadline = new Date(event.deadline_at).getTime();
  const now = new Date().getTime();
  const hoursLeft = Math.floor((deadline - now) / (1000 * 60 * 60));
  const daysLeft = Math.ceil(hoursLeft / 24);

  if (hoursLeft <= 24) {
    return `Closes in ${hoursLeft}h`;
  }
  if (daysLeft <= 3) {
    return `Closing in ${daysLeft} days`;
  }
  return `Closes ${formatShortDate(event.deadline_at)}`;
}

export function groupEventsByWeek(events: EventItem[]): Record<string, EventItem[]> {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(currentWeekStart.getDate() + 7);

  const laterStart = new Date(currentWeekStart);
  laterStart.setDate(currentWeekStart.getDate() + 14);

  const groups: Record<string, EventItem[]> = {
    "This week": [],
    "Next week": [],
    "Later this month": [],
  };

  events.forEach((evt) => {
    const evtDate = new Date(evt.start_at);
    if (evtDate < nextWeekStart) {
      groups["This week"].push(evt);
    } else if (evtDate < laterStart) {
      groups["Next week"].push(evt);
    } else {
      groups["Later this month"].push(evt);
    }
  });

  // Remove empty groups
  const filtered: Record<string, EventItem[]> = {};
  for (const [key, list] of Object.entries(groups)) {
    if (list.length > 0) {
      filtered[key] = list;
    }
  }
  return filtered;
}
