import { MetadataRoute } from "next";
import { SEED_EVENTS } from "@/lib/data/seed-events";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/events",
    "/hackathons",
    "/community",
    "/about",
    "/suggest",
    "/saved",
  ].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const eventPages = SEED_EVENTS.map((event) => ({
    url: `${SITE.url}/events/${event.slug}`,
    lastModified: event.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...eventPages];
}
