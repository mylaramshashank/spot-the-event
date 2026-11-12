"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Github, Mail } from "lucide-react";
import { VenlixLogo } from "@/components/common/VenlixLogo";
import { trackClick } from "@/lib/storage";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[12px] font-sans font-semibold tracking-eyebrow uppercase text-emerald block mb-1">
          BEHIND THE BOARD
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-navy-900 tracking-tight">
          Why Spot the Event Exists
        </h1>
      </div>

      {/* First-person narrative */}
      <div className="bg-paper border border-rule p-6 sm:p-8 rounded-2xl mb-12 space-y-4 text-base font-sans text-navy-900/90 leading-relaxed shadow-xs">
        <p>
          If you follow tech in Hyderabad, you already know the frustration: you watch a reel about an exciting weekend hackathon, drop a comment to get an auto-DM bot link, and either receive nothing or get spammed with twenty irrelevant marketing messages.
        </p>
        <p>
          I started <strong className="font-semibold text-navy-900">Spot the Event</strong> to replace that friction entirely. No bots, no marketing fluff, no generic lists of 400 events that nobody will ever attend. This board contains only the events I personally vet and feature in my reels on <a href="https://instagram.com/buildwithshashankk" target="_blank" rel="noopener noreferrer" className="text-emerald font-semibold hover:underline">@buildwithshashankk</a>.
        </p>
        <p className="pt-2 text-sm text-slate">
          &mdash; Shashank, Co-founder at Venlix
        </p>
      </div>

      {/* About Venlix */}
      <div className="bg-navy-900 text-offwhite p-6 sm:p-8 rounded-2xl mb-12 border border-navy-700 shadow-sm">
        <div className="mb-4">
          <VenlixLogo variant="footer" size={32} />
        </div>
        <h3 className="font-display text-2xl font-semibold text-offwhite mb-3">
          Built by Venlix
        </h3>
        <p className="text-sm font-sans text-offwhite/80 leading-relaxed mb-6">
          Venlix is a visual-first platform that connects tech founders and content creators with elite video editors. Instead of reviewing dry PDF resumes, founders hire editors based directly on timelines, motion samples, and retention cuts.
        </p>
        <a
          href="https://venlix.tech"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("venlix", undefined, "about_page_venlix_link")}
          className="h-11 px-5 rounded-full bg-emerald text-offwhite text-xs font-sans font-semibold inline-flex items-center hover:bg-emerald-600 transition-all shadow-xs"
        >
          Explore Venlix &rarr;
        </a>
      </div>

      {/* Connect with Shashank */}
      <div className="bg-paper border border-rule rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
        <span className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-emerald block mb-1">
          LET&apos;S CONNECT
        </span>
        <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
          Want to collaborate, feature an event, or connect?
        </h3>
        <p className="text-sm font-sans text-slate mb-6 leading-relaxed">
          Whether you&apos;re organizing an engineering hackathon, college devfest, or want to discuss student developer ecosystems in Hyderabad, feel free to reach out directly:
        </p>
        <div className="flex flex-wrap items-center gap-3">
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

      {/* Founders & Team */}
      <div className="border-t border-rule pt-8">
        <h3 className="font-display text-2xl font-semibold text-navy-900 mb-4">
          The Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-paper border border-rule p-5 sm:p-6 rounded-2xl shadow-xs">
            <h4 className="font-display text-xl font-bold text-navy-900">
              Shashank
            </h4>
            <p className="text-xs font-sans text-emerald font-semibold uppercase tracking-wider mb-2">
              Curator & Co-founder
            </p>
            <p className="text-xs font-sans text-slate leading-relaxed mb-4">
              Creator of @buildwithshashankk, vetting hackathons across Hyderabad and building communities for student developers.
            </p>
            <div className="space-y-2 pt-2 border-t border-rule text-xs font-medium text-navy-900">
              <a
                href="https://instagram.com/buildwithshashankk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <span>@buildwithshashankk on Instagram &rarr;</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mylaramshashank/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-navy-700" />
                <span>linkedin.com/in/mylaramshashank</span>
              </a>
              <a
                href="https://github.com/mylaramshashank"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-navy-700" />
                <span>github.com/mylaramshashank</span>
              </a>
              <a
                href="mailto:mylaramshashank@gmail.com"
                className="flex items-center gap-2 text-emerald font-semibold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="bg-paper border border-rule p-5 sm:p-6 rounded-2xl shadow-xs">
            <h4 className="font-display text-xl font-bold text-navy-900">
              Divyend
            </h4>
            <p className="text-xs font-sans text-slate font-semibold uppercase tracking-wider mb-2">
              Engineering & Architecture
            </p>
            <p className="text-xs font-sans text-slate leading-relaxed mb-4">
              Building high-retention creator workflows, performance-first video pipelines, and the Venlix platform engine.
            </p>
            <div className="space-y-2 pt-2 border-t border-rule text-xs font-medium text-navy-900">
              <a
                href="https://venlix.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <span>venlix.tech &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
