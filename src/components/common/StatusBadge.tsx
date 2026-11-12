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
        className={`inline-flex items-center gap-1.5 rounded-md border border-alert/25 bg-alert/10 px-2 py-0.5 text-xs font-semibold text-alert ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-alert" />
        {label || "Closing soon"}
      </span>
    );
  }

  if (status === "ended") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-medium text-mist ${className}`}
      >
        {label || "Ended"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-signal/20 bg-signal-soft px-2 py-0.5 text-xs font-semibold text-signal-dark ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      {label || "Open"}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const formatted = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span className="inline-block rounded-md border border-line bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-ink">
      {formatted}
    </span>
  );
}
