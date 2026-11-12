import React from "react";
import { formatShortDate } from "@/lib/utils";

interface TypographicPosterProps {
  title: string;
  type: string;
  date: string;
  venue: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
  titleSize?: string;
}

export function TypographicPoster({
  title,
  type,
  date,
  venue,
  className = "",
  aspectRatio = "banner",
  titleSize,
}: TypographicPosterProps) {
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
        ? "aspect-[16/9]"
        : "aspect-[21/9] sm:aspect-[24/9]";

  const isCompact = aspectRatio === "video" || aspectRatio === "square";

  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden bg-ink text-white ${aspectClass} ${
        isCompact ? "p-4 sm:p-5" : "p-5 sm:p-7"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(31,169,122,0.28),transparent_42%)]" />
      <div className="absolute inset-0 bg-grid-ink opacity-30" />

      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`${isCompact ? "text-[10px]" : "text-[11px]"} font-semibold uppercase tracking-eyebrow text-signal`}
        >
          Hyderabad · {type}
        </span>
        <span
          className={`${isCompact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"} border border-white/20 font-medium text-white/80`}
        >
          {formatShortDate(date)}
        </span>
      </div>

      <div className="relative z-10 my-auto max-w-xl py-1.5">
        <h3
          className={
            titleSize ||
            (isCompact
              ? "line-clamp-2 text-base font-bold leading-snug tracking-tight sm:text-lg"
              : "font-display text-2xl font-bold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl")
          }
        >
          {title}
        </h3>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 text-[11px] text-white/65">
        <span className="max-w-[70%] truncate">{venue}</span>
        <span className="text-[9px] font-semibold uppercase tracking-eyebrow text-signal">
          Spot the Event
        </span>
      </div>
    </div>
  );
}
