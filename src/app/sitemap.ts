import { MetadataRoute } from "next";
import { fetchPublishedEventsServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://spot-the-event.vercel.app";

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/hackathons", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/events", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/community", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.65, changeFrequency: "monthly" as const },
    { path: "/suggest", priority: 0.65, changeFrequency: "monthly" as const },
  ];

  const staticPages = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    priority,
  }));

  const events = await fetchPublishedEventsServer();
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updated_at || new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...eventPages];
}
