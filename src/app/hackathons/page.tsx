import { Metadata } from "next";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";
import { HackathonsClient } from "@/components/events/HackathonsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hyderabad Hackathons & Coding Competitions 2026 · Cash Prizes up to ₹2.5L",
  description:
    "Discover verified hackathons in Hyderabad with cash prize pools, free college rounds, and 36-hour sprint formats. Curated tracks across AI, Web3, and Cloud with direct links.",
  keywords: [
    "hackathons in hyderabad",
    "hyderabad hackathons 2026",
    "coding competitions hyderabad",
    "student hackathons hyderabad",
    "college hackathons hyderabad",
    "t-hub hackathons",
    "ai hackathons hyderabad",
    "cash prize hackathons hyderabad",
    "overnight hackathons hyderabad",
    "spot the event",
  ],
  alternates: {
    canonical: "https://spot-the-event.vercel.app/hackathons",
  },
  openGraph: {
    title: "Hyderabad Hackathons & Coding Competitions 2026 | Spot the Event",
    description:
      "Explore verified hackathons with cash prizes up to ₹2.5 Lakhs in Hyderabad. Free participation, AI tracks, and official registration links.",
    url: "https://spot-the-event.vercel.app/hackathons",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hyderabad Hackathons & Coding Competitions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyderabad Hackathons & Coding Sprints 2026",
    description: "Explore top hackathons with big cash prize pools in Hyderabad. Zero fluff, real venues.",
    images: ["/og-image.png"],
    creator: "@buildwithshashankk",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Hyderabad Hackathons & Coding Competitions 2026",
  description: "Curated collection of verified student and developer hackathons in Hyderabad.",
  url: "https://spot-the-event.vercel.app/hackathons",
  isPartOf: {
    "@type": "WebSite",
    name: "Spot the Event",
    url: "https://spot-the-event.vercel.app"
  }
};

export default async function HackathonsPage() {
  const events = await fetchPublishedEventsServer();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HackathonsClient initialEvents={events} />
    </>
  );
}
