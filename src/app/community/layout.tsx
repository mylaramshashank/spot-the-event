import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Hyderabad Tech Community & WhatsApp Channel",
  description:
    "Join Spot The Event's official WhatsApp Community Channel for instant alerts on Hyderabad hackathons, limited-seat workshops, and exclusive developer meetups before registrations close.",
  keywords: [
    "hyderabad tech whatsapp channel",
    "hyderabad developer community",
    "hyderabad hackathon whatsapp group",
    "hyderabad coders community",
    "spot the event whatsapp",
    "buildwithshashankk community",
  ],
  alternates: {
    canonical: "https://spot-the-event.vercel.app/community",
  },
  openGraph: {
    title: "Join Hyderabad Tech Community & WhatsApp Channel | Spot the Event",
    description:
      "Instant WhatsApp notifications for Hyderabad hackathons, cash prizes, and free developer workshops before spots fill up.",
    url: "https://spot-the-event.vercel.app/community",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spot the Event WhatsApp Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Hyderabad Tech Events WhatsApp Channel",
    description: "Instant alerts on hackathons and meetups in Hyderabad. Zero spam.",
    images: ["/og-image.png"],
    creator: "@buildwithshashankk",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
