import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-rust block mb-2">
        404 · PAGE NOT FOUND
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-navy-900 mb-4 tracking-tight">
        Event Not Found
      </h1>
      <p className="text-sm font-sans text-slate leading-relaxed mb-8">
        The link may have expired or the reel URL was mistyped. Head back to the curated board to find the latest open events.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/events"
          className="h-11 px-5 rounded-sm bg-navy-900 text-offwhite text-xs font-sans font-semibold inline-flex items-center hover:bg-navy-700 transition-colors"
        >
          Browse All Events &rarr;
        </Link>
        <Link
          href="/"
          className="h-11 px-5 rounded-sm border border-rule bg-paper text-navy-900 text-xs font-sans font-semibold inline-flex items-center hover:border-navy-900/40 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
