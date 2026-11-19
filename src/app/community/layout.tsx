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

const communityFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the Hyderabad tech WhatsApp Channel completely free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, 100% free. No paid tiers, no subscription fees."
      }
    },
    {
      "@type": "Question",
      "name": "Can other members or organizers see my phone number in the WhatsApp Channel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Unlike WhatsApp Groups or Communities, WhatsApp Channels are private broadcast channels. Neither other members nor admins can see your personal phone number or profile details."
      }
    },
    {
      "@type": "Question",
      "name": "How often do you send event updates on the WhatsApp channel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only when a new curated event or hackathon is verified, plus an occasional urgent 24-hour reminder when registrations are closing."
      }
    },
    {
      "@type": "Question",
      "name": "What if Instagram's in-app browser blocks WhatsApp channel links?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the 'Copy Channel Link' button and paste it directly into WhatsApp or open in Safari / Chrome."
      }
    }
  ]
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(communityFaqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
