import React from "react";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";
import { HomePageClient } from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialEvents = await fetchPublishedEventsServer();

  const baseUrl = "https://spot-the-event.vercel.app";

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/#featured-events`,
    name: "Upcoming Tech Events & Hackathons in Hyderabad",
    description:
      "Curated list of verified hackathons, coding competitions, AI workshops, and developer meetups happening in Hyderabad.",
    numberOfItems: initialEvents.length,
    itemListElement: initialEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: event.title,
      url: `${baseUrl}/events/${event.slug}`,
      description: event.featured_note || event.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HomePageClient initialEvents={initialEvents} />
    </>
  );
}
