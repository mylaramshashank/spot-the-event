import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tech Events, Hackathons & Meetups in Hyderabad",
  description:
    "Browse every upcoming tech event in Hyderabad: developer meetups, AI workshops, startup conferences, and hackathons. Filter by free entry, format, and date.",
  keywords: [
    "tech events in hyderabad",
    "hyderabad tech meetups",
    "developer workshops hyderabad",
    "ai conferences hyderabad",
    "free tech events hyderabad",
    "hitec city tech events",
    "gachibowli developer meetups",
    "coding events hyderabad",
    "spot the event",
  ],
  alternates: {
    canonical: "https://spot-the-event.vercel.app/events",
  },
  openGraph: {
    title: "All Tech Events, Hackathons & Meetups in Hyderabad | Spot the Event",
    description:
      "Browse verified developer meetups, AI workshops, and hackathons in Hyderabad. Zero bots, direct registration links.",
    url: "https://spot-the-event.vercel.app/events",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hyderabad Tech Events, Hackathons & Meetups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Tech Events & Meetups in Hyderabad",
    description: "Browse verified developer meetups, AI workshops, and hackathons in Hyderabad.",
    images: ["/og-image.png"],
    creator: "@buildwithshashankk",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
