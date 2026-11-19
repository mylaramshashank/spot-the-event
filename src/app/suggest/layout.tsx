import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Hyderabad Tech Event or Hackathon",
  description:
    "Organizing or discovered an exciting tech event, college hackathon, or developer meetup in Hyderabad? Submit it here to get featured on Spot the Event and @buildwithshashankk.",
  keywords: [
    "submit hackathon hyderabad",
    "feature tech event hyderabad",
    "promote hackathon hyderabad",
    "spot the event submission",
  ],
  alternates: {
    canonical: "https://spot-the-event.vercel.app/suggest",
  },
  openGraph: {
    title: "Submit a Hyderabad Tech Event or Hackathon | Spot the Event",
    description: "Submit your tech event or hackathon to reach thousands of Hyderabad builders and developers.",
    url: "https://spot-the-event.vercel.app/suggest",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SuggestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
