import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-alert">
        404 · Not found
      </p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-mist">
        The link may have expired or the reel code was mistyped. Head back to the board for open events.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/events"
          className="inline-flex h-11 items-center rounded-md bg-ink px-5 text-xs font-semibold text-white"
        >
          Browse events →
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-md border border-line bg-paper px-5 text-xs font-semibold text-ink"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
