import { EventItem } from "@/types";
import { sanitizeExternalUrl } from "./utils";

function formatIcsDate(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(val: string): string {
  return String(val || "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function sanitizeUidPart(val: string): string {
  return String(val || "event").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64);
}

export function getGoogleCalendarUrl(event: EventItem): string {
  const start = formatIcsDate(event.start_at);
  const end = formatIcsDate(event.end_at);

  const safeRegister = sanitizeExternalUrl(event.register_url);
  const detailsText = safeRegister !== "#"
    ? `${event.description}\n\nRegister at: ${safeRegister}`
    : event.description;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: detailsText,
    location: `${event.venue_name}, ${event.city}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(event: EventItem): string {
  const start = formatIcsDate(event.start_at);
  const end = formatIcsDate(event.end_at);
  const now = formatIcsDate(new Date().toISOString());
  const safeRegister = sanitizeExternalUrl(event.register_url);
  const safeEventPage = `https://spot-the-event.vercel.app/events/${encodeURIComponent(event.slug)}`;

  const summary = escapeIcsText(event.title);
  const description = escapeIcsText(
    safeRegister !== "#"
      ? `${event.description}\n\nRegister: ${safeRegister}`
      : event.description
  );
  const location = escapeIcsText(`${event.venue_name}, ${event.city}`);
  const uid = `${sanitizeUidPart(event.id)}@spot-the-event.vercel.app`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Venlix//SpotTheEvent//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${safeEventPage}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(event: EventItem): void {
  const icsData = buildIcsContent(event);
  const safeSlug = sanitizeUidPart(event.slug) || "event";
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeSlug}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
