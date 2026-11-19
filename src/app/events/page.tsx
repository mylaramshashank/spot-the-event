import React, { Suspense } from "react";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";
import { EventsCatalogClient } from "@/components/events/EventsCatalogClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const initialEvents = await fetchPublishedEventsServer();
  const baseUrl = "https://spot-the-event.vercel.app";

  const eventsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/events#catalog`,
    name: "All Hyderabad Tech Events, Hackathons & Workshops 2026",
    description:
      "Directory of verified hackathons, coding contests, AI workshops, and developer meetups in Hyderabad.",
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
          __html: JSON.stringify(eventsStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-xs font-sans text-slate">Loading events board...</p>
          </div>
        }
      >
        <EventsCatalogClient initialEvents={initialEvents} />
      </Suspense>
    </>
  );
}
