"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPublishedEvents } from "@/lib/storage";

export default function ReelCodeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string) || "";

  useEffect(() => {
    if (!code) {
      router.replace("/events");
      return;
    }

    const clean = code.trim();
    if (!/^[a-zA-Z0-9_-]{1,32}$/.test(clean)) {
      router.replace("/events");
      return;
    }

    let cancelled = false;
    fetchPublishedEvents().then((events) => {
      if (cancelled) return;
      const event = events.find(
        (e) => e.reel_code === clean || e.reel_code === clean.padStart(2, "0")
      );
      if (event?.slug) {
        const safeSlug = encodeURIComponent(event.slug.replace(/[^a-zA-Z0-9-_]/g, ""));
        router.replace(`/events/${safeSlug}`);
      } else {
        router.replace(`/events?q=${encodeURIComponent(clean.slice(0, 50))}`);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="font-display text-2xl font-semibold text-navy-900 mb-2">
        Redirecting from Reel #{code}...
      </p>
      <p className="text-xs font-sans text-slate">
        Taking you directly to the verified registration page.
      </p>
    </div>
  );
}
