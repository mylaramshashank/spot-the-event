"use client";

import React from "react";
import { trackClick } from "@/lib/storage";

export function VenlixStrip() {
  const handleClick = () => {
    trackClick("venlix", undefined, "home_venlix_strip");
  };

  return (
    <div className="w-full py-6 px-4 border-t border-rule bg-offwhite text-center">
      <p className="text-xs sm:text-sm font-sans text-slate">
        Spot the Event is built by{" "}
        <a
          href="https://venlix.tech"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="font-semibold text-navy-900 hover:text-emerald underline underline-offset-2 transition-colors"
        >
          Venlix
        </a>
        , a visual-first way to hire video editors.
      </p>
    </div>
  );
}
