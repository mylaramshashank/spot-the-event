"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventByReelCode } from "@/lib/storage";

export default function ReelCodeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string) || "";

  useEffect(() => {
    if (!code) {
      router.replace("/events");
      return;
    }

    const event = getEventByReelCode(code);
    if (event && event.slug) {
      const safeSlug = encodeURIComponent(event.slug.replace(/[^a-zA-Z0-9-_]/g, ""));
      router.replace(`/events/${safeSlug}`);
    } else {
      const safeQuery = encodeURIComponent(code.trim().slice(0, 50));
      router.replace(`/events?q=${safeQuery}`);
    }
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
