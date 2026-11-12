"use client";

import React from "react";
import { trackClick } from "@/lib/storage";
import { SITE } from "@/lib/site";

export function VenlixStrip() {
  return (
    <div className="border-t border-line bg-chalk px-4 py-6 text-center">
      <p className="text-sm text-mist">
        Spot the Event is built by{" "}
        <a
          href={SITE.venlix.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("venlix", undefined, "home_venlix_strip")}
          className="font-semibold text-ink underline-offset-2 hover:text-signal hover:underline"
        >
          Venlix
        </a>
        , a visual-first way to hire video editors.
      </p>
    </div>
  );
}
