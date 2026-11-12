import { MetadataRoute } from "next";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://spot-the-event.vercel.app";

  const staticPages = [
    "",
    "/events",
    "/hackathons",
    "/community",
    "/about",
    "/suggest",
    "/saved",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const events = await fetchPublishedEventsServer();
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...eventPages];
}
