"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatShortDate, sanitizeExternalUrl } from "@/lib/utils";

interface TypographicPosterProps {
  title: string;
  type: string;
  date: string;
  venue: string;
  posterUrl?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
  titleSize?: string;
}

export function TypographicPoster({
  title,
  type,
  date,
  venue,
  posterUrl,
  className = "",
  aspectRatio = "banner",
  titleSize,
}: TypographicPosterProps) {
  const [imgError, setImgError] = useState(false);
  const [bannerShape, setBannerShape] = useState<"wide" | "og" | "square">("wide");

  const isCompact = aspectRatio === "video" || aspectRatio === "square";
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
      ? "aspect-[16/9]"
      : bannerShape === "square"
      ? "aspect-[4/3] sm:aspect-[16/9] max-h-[420px]"
      : bannerShape === "og"
      ? "aspect-[16/9] sm:aspect-[19/10]"
      : "aspect-[21/9] sm:aspect-[24/9]";

  const useContain = isCompact || bannerShape !== "wide";

  const safePoster = posterUrl ? sanitizeExternalUrl(posterUrl) : "#";
  const hasPoster = safePoster !== "#" && !imgError;

  if (hasPoster) {
    return (
      <div
        className={`relative w-full ${aspectClass} bg-white overflow-hidden border-b border-rule ${className}`}
      >
        <Image
          src={safePoster}
          alt={title}
          fill
          priority={aspectRatio === "banner"}
          sizes={isCompact ? "(max-width: 640px) 280px, 320px" : "(max-width: 1024px) 100vw, 1024px"}
          className={useContain ? "object-contain object-center" : "object-cover object-center"}
          onLoad={(e) => {
            if (aspectRatio === "banner") {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalHeight > 0) {
                const ratio = naturalWidth / naturalHeight;
                if (ratio < 1.6) {
                  setBannerShape("square");
                } else if (ratio < 2.15) {
                  setBannerShape("og");
                }
              }
            }
          }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} bg-navy-900 text-offwhite ${
        isCompact ? "p-4 sm:p-5" : "p-5 sm:p-7"
      } flex flex-col justify-between overflow-hidden border border-rule ${className}`}
    >
      {/* Subtle geometric pixel watermark */}
      <div className="absolute top-4 right-4 opacity-15 pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect x="2" y="2" width="13" height="13" rx="2" fill="#FCFAF5" />
          <rect x="17" y="17" width="13" height="13" rx="2" fill="#17795A" />
        </svg>
      </div>

      <div className="flex items-center justify-between z-10">
        <span className={`${isCompact ? "text-[10px]" : "text-[11px]"} font-sans font-semibold tracking-eyebrow uppercase text-emerald`}>
          HYDERABAD · {type.toUpperCase()}
        </span>
        <span className={`${isCompact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"} font-sans font-medium text-offwhite/80 border border-offwhite/20 rounded-sm`}>
          {formatShortDate(date)}
        </span>
      </div>

      <div className="my-auto py-1.5 z-10 max-w-xl">
        <h3
          className={
            titleSize
              ? titleSize
              : isCompact
              ? "text-base sm:text-lg font-bold leading-snug text-offwhite tracking-tight line-clamp-2"
              : "font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.1] text-offwhite tracking-tight"
          }
        >
          {title}
        </h3>
      </div>

      <div className="flex items-center border-t border-offwhite/15 pt-2 z-10 text-[11px] font-sans text-offwhite/70">
        <span className="truncate w-full">{venue}</span>
      </div>
    </div>
  );
}
