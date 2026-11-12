import React from "react";

interface VenlixLogoProps {
  variant?: "mark" | "header" | "footer";
  className?: string;
  size?: number;
}

export function VenlixLogo({ variant = "mark", className = "", size = 28 }: VenlixLogoProps) {
  // Flat two-color redraw:
  // Top-left square in Navy 900 (#0B1530),
  // Bottom-right square in Emerald (#17795A),
  // Pixels in Navy 700 (#16264F). No glow.
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Venlix logo"
    >
      {/* Top-left rounded square in Navy 900 */}
      <rect x="2" y="2" width="13" height="13" rx="3" fill="#0B1530" />
      {/* Connecting pixels in Navy 700 */}
      <rect x="17" y="5" width="4" height="4" rx="1" fill="#16264F" />
      <rect x="11" y="17" width="4" height="4" rx="1" fill="#16264F" />
      <rect x="17" y="11" width="4" height="4" rx="1" fill="#17795A" />
      {/* Bottom-right rounded square in Emerald */}
      <rect x="17" y="17" width="13" height="13" rx="3" fill="#17795A" />
    </svg>
  );

  if (variant === "mark") {
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
  }

  if (variant === "header") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {mark}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
          <span className="text-sm sm:text-base font-extrabold leading-tight tracking-tight text-navy-900 whitespace-nowrap">
            Spot the Event
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 lowercase tracking-normal whitespace-nowrap">
            by venlix
          </span>
        </div>
      </div>
    );
  }

  // Footer / About lockup
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-offwhite">
          Spot the Event
        </span>
        <span className="text-xs uppercase font-semibold tracking-eyebrow text-offwhite/70">
          An editorial initiative by Venlix
        </span>
      </div>
    </div>
  );
}

export function VenlixPixelLoader() {
  // Venlix pixel motif loader: 5 small squares fading between navy and emerald
  return (
    <div className="inline-flex items-center gap-1.5" role="status" aria-label="Loading">
      <span className="w-2 h-2 rounded-[2px] bg-navy-900 animate-pulse" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 rounded-[2px] bg-navy-700 animate-pulse" style={{ animationDelay: "200ms" }} />
      <span className="w-2 h-2 rounded-[2px] bg-emerald animate-pulse" style={{ animationDelay: "400ms" }} />
      <span className="w-2 h-2 rounded-[2px] bg-navy-700 animate-pulse" style={{ animationDelay: "600ms" }} />
      <span className="w-2 h-2 rounded-[2px] bg-emerald animate-pulse" style={{ animationDelay: "800ms" }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
