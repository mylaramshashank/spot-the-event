import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";
import { EventDetailClient } from "@/components/events/EventDetailClient";
import { formatDate, sanitizeExternalUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface EventPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const allEvents = await fetchPublishedEventsServer();
  const event = allEvents.find((e) => e.slug === params.slug);

  if (!event) {
    return {
      title: "Event Not Found · Spot the Event",
      description: "This Hyderabad tech event or hackathon could not be found.",
    };
  }

  const title = `${event.title} · Hyderabad Tech Event`;
  const cleanDesc = (event.featured_note || event.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  const description = `${event.title} in Hyderabad (${formatDate(event.start_at)}). Venue: ${event.venue_name.split(",")[0]}. ${cleanDesc}`;
  const canonicalUrl = `https://spot-the-event.vercel.app/events/${event.slug}`;
  const posterUrl = event.poster_url ? sanitizeExternalUrl(event.poster_url) : "/og-image.png";
  const absolutePosterUrl = posterUrl.startsWith("http")
    ? posterUrl
    : `https://spot-the-event.vercel.app${posterUrl}`;

  return {
    title,
    description,
    keywords: [
      event.title,
      event.type,
      "hackathons in hyderabad",
      "hyderabad tech events",
      "hyderabad hackathons 2026",
      "developer meetups hyderabad",
      event.organizer,
      event.city,
      "spot the event",
      "buildwithshashankk",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Spot the Event",
      locale: "en_IN",
      type: "article",
      images: [
        {
          url: absolutePosterUrl,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absolutePosterUrl],
      creator: "@buildwithshashankk",
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const allEvents = await fetchPublishedEventsServer();
  const event = allEvents.find((e) => e.slug === params.slug);

  if (!event) {
    notFound();
  }

  const isEnded = new Date(event.deadline_at || event.end_at).getTime() < Date.now();
  const posterUrl = event.poster_url ? sanitizeExternalUrl(event.poster_url) : "/og-image.png";
  const absolutePosterUrl = posterUrl.startsWith("http")
    ? posterUrl
    : `https://spot-the-event.vercel.app${posterUrl}`;

  // Schema.org Event JSON-LD for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_at,
    endDate: event.end_at,
    eventAttendanceMode:
      event.mode === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: isEnded
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue_name,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city || "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
    image: [absolutePosterUrl],
    description: event.description,
    offers: {
      "@type": "Offer",
      price: event.is_free ? "0" : (event.fee_text.match(/\d[\d,]*/)?.[0]?.replace(/,/g, "") || "0"),
      priceCurrency: "INR",
      url: sanitizeExternalUrl(event.register_url),
      availability: isEnded
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      validThrough: event.deadline_at,
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      url: "https://spot-the-event.vercel.app",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <EventDetailClient event={event} allEvents={allEvents} />
    </>
  );
}
