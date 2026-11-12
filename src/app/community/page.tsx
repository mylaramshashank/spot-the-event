"use client";

import React, { useState } from "react";
import { ChevronDown, Linkedin, Github, Mail } from "lucide-react";
import { trackClick } from "@/lib/storage";

export default function CommunityPage() {
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const channelUrl = "https://whatsapp.com/channel/0029Vb9d8yhK5cDAGTE94z47";

  const handleJoin = () => {
    trackClick("whatsapp", undefined, "community_page_join");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(channelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Is the WhatsApp Channel completely free?",
      a: "Yes, 100% free. No paid tiers, no subscription models.",
    },
    {
      q: "Can other members or organizers see my phone number?",
      a: "No. Unlike WhatsApp Groups or Communities, WhatsApp Channels are private broadcast channels. Neither other members nor admins can see your personal phone number or profile details.",
    },
    {
      q: "How often do you broadcast messages?",
      a: "Only when a new curated event or hackathon is verified, plus an occasional urgent 24-hour reminder when registrations are closing.",
    },
    {
      q: "What if Instagram's in-app browser blocks WhatsApp links?",
      a: "Use the 'Copy Channel Link' button above and paste it directly into WhatsApp or Safari / Chrome.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[12px] font-semibold tracking-eyebrow uppercase text-emerald-600 block mb-1">
          HYDERABAD BUILDERS COMMUNITY
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight">
          The WhatsApp Channel
        </h1>
        <p className="mt-3 text-base text-slate leading-relaxed">
          Only verified Hyderabad hackathons, meetups, and workshops. Zero member chatter.
        </p>
      </div>

      {/* Main CTA Block */}
      <div className="bg-navy-900 text-offwhite p-6 sm:p-8 rounded-3xl shadow-xl mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-offwhite mb-3">
          Join 4,200+ Hyderabad engineering students
        </h2>
        <p className="text-sm text-offwhite/80 leading-relaxed mb-6">
          Be the first to get registration links before reels hit the Instagram algorithm.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoin}
            className="h-12 px-6 rounded-full bg-emerald text-white font-semibold text-sm inline-flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all text-center shadow-md"
          >
            Open in WhatsApp &rarr;
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="h-12 px-5 rounded-full border border-offwhite/20 hover:border-offwhite/40 text-offwhite font-medium text-xs inline-flex items-center justify-center transition-colors"
          >
            {copied ? "Link Copied to Clipboard!" : "Copy Channel Link"}
          </button>
        </div>
      </div>

      {/* What You Get */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-navy-900 mb-6 pb-2 border-b border-rule">
          What you get
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-paper border border-rule p-5 sm:p-6 rounded-2xl shadow-xs">
            <span className="text-rust font-semibold text-xs tracking-eyebrow block mb-2">
              01 / DEADLINE ALERTS
            </span>
            <h4 className="text-lg font-bold text-navy-900 mb-1">
              48h Warnings
            </h4>
            <p className="text-xs sm:text-sm text-slate leading-relaxed">
              When high-value hackathons near registration capacity, we send a quick ping so you don’t miss out.
            </p>
          </div>

          <div className="bg-paper border border-rule p-5 sm:p-6 rounded-2xl shadow-xs">
            <span className="text-navy-900 font-semibold text-xs tracking-eyebrow block mb-2">
              02 / ZERO SPAM
            </span>
            <h4 className="text-lg font-bold text-navy-900 mb-1">
              No Group Chatter
            </h4>
            <p className="text-xs sm:text-sm text-slate leading-relaxed">
              Broadcast only. No &ldquo;good morning&rdquo; texts, no college election forwards, no noise.
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible FAQ Accordion */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-navy-900 mb-6 pb-2 border-b border-rule">
          Frequently asked questions
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
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
                  <h4 className="text-base sm:text-lg font-bold text-navy-900">
                    {faq.q}
                  </h4>
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
      </div>

      {/* Connect with Shashank */}
      <div className="bg-paper border border-rule rounded-2xl p-6 sm:p-8 text-center shadow-xs">
        <h3 className="text-xl font-bold text-navy-900 mb-2">
          Want to connect directly with Shashank?
        </h3>
        <p className="text-xs sm:text-sm text-slate max-w-md mx-auto mb-5 leading-relaxed">
          Questions about an event, feedback on the board, or collaboration inquiries — feel free to reach out anytime.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.linkedin.com/in/mylaramshashank/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy-900 text-offwhite text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            <Linkedin className="w-3.5 h-3.5 text-emerald" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://github.com/mylaramshashank"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy-900 text-offwhite text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            <Github className="w-3.5 h-3.5 text-emerald" />
            <span>GitHub</span>
          </a>
          <a
            href="mailto:mylaramshashank@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
