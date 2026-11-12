import React from "react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Watch the reel",
      description: "Catch the weekly 45-second teardown on Instagram highlighting deadlines, team requirements, and cash prizes.",
    },
    {
      num: "02",
      title: "Open link in bio",
      description: "Spot the Event loads in under 1 second inside Instagram's in-app browser with direct access to the latest featured events.",
    },
    {
      num: "03",
      title: "Register in one tap",
      description: "No auto-DM spam, no account creation, no paywall. Tap once to reach the verified official organizer registration form.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="mb-8">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-slate block mb-1">
          04 / HOW IT WORKS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          From screen to venue in 30 seconds
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-5 sm:p-6 rounded-2xl bg-paper border border-rule shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold tracking-eyebrow text-emerald-600 block mb-2">
                STEP {step.num}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-navy-900 mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-slate leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
