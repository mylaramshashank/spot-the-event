import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Spot the Event · Curated by Shashank & Venlix",
  description:
    "Spot the Event is Hyderabad's community-first platform for discovering verified tech events, hackathons, and founder meetups without spam, auto-DM bots, or marketing noise.",
  keywords: [
    "about spot the event",
    "mylaram shashank",
    "buildwithshashankk",
    "venlix",
    "hyderabad tech ecosystem",
  ],
  alternates: {
    canonical: "https://spot-the-event.vercel.app/about",
  },
  openGraph: {
    title: "About Spot the Event · Curated by Shashank & Venlix",
    description: "The story behind Spot the Event: eliminating noise and helping Hyderabad students build.",
    url: "https://spot-the-event.vercel.app/about",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
