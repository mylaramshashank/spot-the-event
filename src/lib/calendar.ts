import { EventItem } from "@/types";

export function getGoogleCalendarUrl(event: EventItem): string {
  const start = new Date(event.start_at).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(event.end_at).toISOString().replace(/-|:|\.\d\d\d/g, "");

  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `${event.description}\n\nVenue: ${event.venue_name}\nRegister at: ${event.register_url}\nFeatured on Spot the Event by Venlix`
  );
  const location = encodeURIComponent(`${event.venue_name}, ${event.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(event: EventItem): void {
  const formatIcsDate = (dateString: string) => {
    return new Date(dateString)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
  };

  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Venlix//Spot the Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@spot.venlix.tech`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(event.start_at)}`,
    `DTEND:${formatIcsDate(event.end_at)}`,
    `SUMMARY:${event.title.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
    `LOCATION:${event.venue_name.replace(/,/g, "\\,")}, ${event.city}`,
    `URL:${event.register_url}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
