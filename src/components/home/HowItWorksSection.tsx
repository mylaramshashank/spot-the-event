import React from "react";

const steps = [
  {
    num: "01",
    title: "Watch the reel",
    description:
      "Catch the short teardown on Instagram — deadlines, team size, prize, venue.",
  },
  {
    num: "02",
    title: "Open link in bio",
    description:
      "Land here from Instagram. Search the event you just saw — no AutoDM bot.",
  },
  {
    num: "03",
    title: "Register officially",
    description:
      "One tap to the verified organizer form. Details, maps, and calendar stay on this page.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-line px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
          How it works
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Reel to registration in under a minute
        </h2>

        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.num} className="border-t-2 border-signal pt-5">
              <span className="font-display text-sm font-bold text-signal">Step {step.num}</span>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
