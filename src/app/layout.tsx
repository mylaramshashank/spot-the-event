import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://spot-the-event.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Spot the Event · Hyderabad Tech Events, Hackathons & Meetups",
    template: "%s | Spot the Event",
  },
  description:
    "Discover verified hackathons, developer meetups, AI workshops, and coding competitions in Hyderabad with cash prizes up to ₹2.5 Lakhs. Curated by @buildwithshashankk with direct registration links.",
  keywords: [
    "hackathons in hyderabad",
    "hyderabad tech events",
    "hyderabad hackathons 2026",
    "hyderabad developer meetups",
    "ai workshops hyderabad",
    "coding competitions hyderabad",
    "college hackathons hyderabad",
    "student hackathons hyderabad",
    "free tech workshops hyderabad",
    "t-hub hyderabad events",
    "hitec city tech meetups",
    "gachibowli developer events",
    "google buildathon hyderabad",
    "cash prize hackathons hyderabad",
    "spot the event",
    "buildwithshashankk",
    "venlix",
  ],
  authors: [{ name: "Mylaram Shashank", url: "https://instagram.com/buildwithshashankk" }],
  creator: "Mylaram Shashank",
  publisher: "Venlix",
  applicationName: "Spot the Event",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Spot the Event · Hyderabad Tech Events, Hackathons & Meetups",
    description:
      "Every verified Hyderabad tech event, hackathon, and developer workshop with direct registration links and cash prizes.",
    url: SITE_URL,
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spot the Event - Hyderabad Tech Events & Hackathons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spot the Event · Hyderabad Tech Events & Hackathons",
    description:
      "Every verified Hyderabad tech event, hackathon, and developer meetup from the reels in one place.",
    images: ["/og-image.png"],
    creator: "@buildwithshashankk",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1530",
};

const jsonLdGlobal = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Spot the Event",
      "alternateName": ["Spot The Event Hyderabad", "Venlix Spot The Event"],
      "description": "Curated Hyderabad tech events, hackathons, and developer workshops.",
      "inLanguage": "en-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/events?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Spot the Event",
      "url": SITE_URL,
      "logo": `${SITE_URL}/icon.svg`,
      "founder": {
        "@type": "Person",
        "name": "Mylaram Shashank",
        "url": "https://instagram.com/buildwithshashankk"
      },
      "sameAs": [
        "https://instagram.com/buildwithshashankk",
        "https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47",
        "https://www.linkedin.com/in/mylaramshashank/",
        "https://venlix.tech"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="bg-offwhite text-navy-900 selection:bg-emerald-100 selection:text-navy-900 flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
