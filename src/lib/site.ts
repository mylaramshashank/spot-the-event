export const SITE = {
  name: "Spot the Event",
  tagline: "Hyderabad tech events from the reels",
  description:
    "Hyderabad-focused hub for hackathons, meetups, and workshops. Watch the reel, open this site, find the event, register on the official link — no AutoDM.",
  url: "https://spot.venlix.tech",
  locale: "en_IN",
  city: "Hyderabad",
  curator: {
    name: "Shashank",
    handle: "@buildwithshashankk",
    instagram: "https://www.instagram.com/buildwithshashankk/",
    github: "https://github.com/mylaramshashank",
    linkedin: "https://www.linkedin.com/in/mylaramshashank/",
    email: "mailto:mylaramshashank@gmail.com",
  },
  venlix: {
    name: "Venlix",
    url: "https://venlix.tech",
  },
  /** Replace with your real WhatsApp Channel invite when ready */
  whatsappChannel: "https://whatsapp.com/channel/0029Vaexample",
} as const;

export function eventShareUrl(slug: string): string {
  return `${SITE.url}/events/${slug}`;
}

export function reelRedirectUrl(code: string): string {
  return `${SITE.url}/r/${code}`;
}
