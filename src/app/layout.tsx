import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spot the Event by Venlix · Hyderabad Tech Events",
  description:
    "Curated tech events, hackathons, meetups and workshops in Hyderabad featured on @buildwithshashankk. Watch the reel, open the site, register in under 30 seconds.",
  metadataBase: new URL("https://spot-the-event.vercel.app"),
  openGraph: {
    title: "Spot the Event by Venlix · Hyderabad Tech Events",
    description:
      "Every Hyderabad tech event, hackathon and workshop from the reels in one place.",
    url: "https://spot-the-event.vercel.app",
    siteName: "Spot the Event",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spot the Event by Venlix",
    description: "Hyderabad tech events, hackathons and meetups from the reels.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1530",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="bg-offwhite text-navy-900 selection:bg-emerald-100 selection:text-navy-900 flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
