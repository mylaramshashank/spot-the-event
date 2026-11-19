"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const HOME_FAQS = [
  {
    q: "Where can I find verified hackathons and tech events in Hyderabad?",
    a: "Spot the Event curates all verified hackathons, coding contests, AI workshops, and developer meetups happening across Hyderabad (HITEC City, Gachibowli, T-Hub, MLRIT, IIIT Hyderabad) with cash prize details, team sizes, and direct registration links.",
  },
  {
    q: "Are the hackathons and workshops listed on Spot the Event free?",
    a: "Most hackathons and tech meetups on Spot the Event are 100% free to attend, often including free food, developer swags, mentor guidance, and cash prize pools up to ₹2.5 Lakhs. Any paid workshop or conference is clearly labeled with its exact registration cost.",
  },
  {
    q: "How do I register for a Hyderabad hackathon or tech meetup?",
    a: "Click on any event on Spot the Event to see the venue, timeline, rules, and eligibility. Tap 'Register on Official Site' to go straight to the official organizer form (Luma, Devfolio, Unstop, or Google Forms) with zero sign-up friction.",
  },
  {
    q: "How can student clubs or tech organizers list their event?",
    a: "College societies and tech organizers can submit their event through our 'Suggest an Event' page. Every submission is reviewed and verified with the organizing team before being published to our 4,000+ builder community.",
  },
  {
    q: "How do I get instant WhatsApp alerts before event deadlines?",
    a: "Join our official Spot the Event WhatsApp Channel (@buildwithshashankk community). We send broadcast alerts for high-value hackathons, AI conferences, and 48-hour deadline warnings with zero spam or group chatter.",
  },
];

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rule">
      <div className="mb-8">
        <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-slate block mb-1">
          05 / FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 tracking-tight">
          Everything you need to know about Hyderabad Tech Events
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate">
          Common questions from Hyderabad engineering students, developers, and event organizers.
        </p>
      </div>

      <div className="space-y-3 max-w-4xl">
        {HOME_FAQS.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={i}
              className="bg-paper border border-rule rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-surface/50 transition-colors"
                aria-expanded={isOpen}
              >
                <h3 className="text-base sm:text-lg font-bold text-navy-900">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate leading-relaxed border-t border-rule/50 animate-in fade-in duration-150">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
