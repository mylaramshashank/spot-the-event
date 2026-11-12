import React from "react";
import { EventComputedStatus } from "@/lib/utils";

interface StatusBadgeProps {
  status: EventComputedStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  if (status === "closing_soon") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold text-rust bg-rust/10 border border-rust/30 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rust" />
        {label || "Closing soon"}
      </span>
    );
  }

  if (status === "ended") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium text-slate bg-rule/50 border border-rule ${className}`}
      >
        {label || "Ended"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold text-emerald bg-emerald-100 border border-emerald/20 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
      {label || "Open"}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const formatted = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-eyebrow uppercase text-navy-900 bg-surface border border-rule rounded-full">
      {formatted}
    </span>
  );
}
