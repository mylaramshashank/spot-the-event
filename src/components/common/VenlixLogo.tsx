import React from "react";
import { cn } from "@/lib/utils";

interface VenlixLogoProps {
  variant?: "mark" | "header" | "footer";
  className?: string;
  size?: number;
  inverted?: boolean;
}

export function VenlixLogo({
  variant = "mark",
  className = "",
  size = 28,
  inverted = false,
}: VenlixLogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="13" height="13" rx="3" fill={inverted ? "#EEF1F4" : "#12151C"} />
      <rect x="17" y="5" width="4" height="4" rx="1" fill={inverted ? "#A8B0BF" : "#2A3142"} />
      <rect x="11" y="17" width="4" height="4" rx="1" fill={inverted ? "#A8B0BF" : "#2A3142"} />
      <rect x="17" y="11" width="4" height="4" rx="1" fill="#1FA97A" />
      <rect x="17" y="17" width="13" height="13" rx="3" fill="#1FA97A" />
    </svg>
  );

  if (variant === "mark") {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  if (variant === "header") {
    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        {mark}
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-sm font-extrabold tracking-tight sm:text-base",
              inverted ? "text-white" : "text-ink"
            )}
          >
            Spot the Event
          </span>
          <span
            className={cn(
              "mt-0.5 text-[10px] font-medium tracking-wide",
              inverted ? "text-white/60" : "text-mist"
            )}
          >
            by Venlix · Hyderabad
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {mark}
      <div className="flex flex-col">
        <span className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Spot the Event
        </span>
        <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
          An editorial board by Venlix
        </span>
      </div>
    </div>
  );
}

export function VenlixPixelLoader() {
  return (
    <div className="inline-flex items-center gap-1.5" role="status" aria-label="Loading">
      <span className="h-2 w-2 animate-pulse rounded-[2px] bg-ink" />
      <span className="h-2 w-2 animate-pulse rounded-[2px] bg-ink-mute" style={{ animationDelay: "150ms" }} />
      <span className="h-2 w-2 animate-pulse rounded-[2px] bg-signal" style={{ animationDelay: "300ms" }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
