const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf-8')
    .split(/\r?\n/)
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const events = [
  {
    id: 'a11ac84f-4d32-472e-848e-26f5d130a007',
    slug: 'llm-observability-pretraining-to-production-aiyatra',
    title: 'LLM Observability: From Pre-Training to Production – AIYatra & Grafana',
    type: 'workshop',
    start_at: '2026-11-28T09:00:00+05:30',
    end_at: '2026-11-28T17:00:00+05:30',
    venue_name: 'London Stock Exchange Group (LSEG), Inorbit Mall Rd, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081',
    venue_map_url: 'https://maps.google.com/?q=London+Stock+Exchange+Group+Madhapur+Hyderabad',
    city: 'Hyderabad',
    mode: 'in_person',
    fee_text: 'Free (RSVP + Form Mandatory)',
    is_free: true,
    eligibility: 'Developers, ML/LLM Engineers, AI Practitioners & Tech Enthusiasts (Bring your laptop)',
    team_size: 'Individual / Hackathon Teams',
    prize: 'Hands-on Hackathon, Free Lunch & Sponsor Perks',
    organizer: 'AIYatra & Grafana and Friends Hyderabad',
    register_url: 'https://www.meetup.com/aiyatra/events/317425521/?eventOrigin=home_page_upcoming_events%24al',
    deadline_at: '2026-11-28T08:00:00+05:30',
    reel_url: null,
    reel_code: '07',
    poster_url: '/posters/llm-observability-aiyatra-lseg.jpg',
    description: [
      'LLM Observability: From Pre-Training to Production is a full-day in-person workshop and hands-on hackathon at London Stock Exchange Group (LSEG) Hyderabad, presented by AIYatra and sponsored by Grafana and Friends Hyderabad.',
      '',
      '⚠️ MANDATORY ENTRY REQUIREMENT:',
      'You MUST both RSVP on Meetup AND fill this mandatory Google Form for security access at LSEG:',
      '👉 Google Form: https://forms.gle/QqPNKqavEGK7phjG9',
      '(If either is not completed, building security will not permit entry at the venue).',
      '',
      'What We\'ll Cover:',
      '• Pre-Training: Gradient norms, loss dynamics, MoE expert balancing, GPU utilization, and training throughput.',
      '• Post-Training: KL divergence, reward dynamics, reward hacking, and model evaluation metrics.',
      '• Inference: TTFT (Time to First Token), TPOT (Time per Output Token), KV cache utilization, GPU memory, batching, and throughput.',
      '• Production Applications: Cost per request, response quality, agent and tool-call tracing, task success, and application-level monitoring.',
      '',
      'Event Schedule (Saturday, 28 Nov 2026):',
      '• 9:00 AM – 10:10 AM: Session 1 (LLM Pre-Training Observability)',
      '• 10:10 AM – 10:50 AM: Session 2 (Post-Training & Reward Dynamics)',
      '• 10:50 AM – 11:05 AM: Tea Break ☕',
      '• 11:05 AM – 11:45 AM: Session 3 (Inference Metrics & GPU KV Cache)',
      '• 11:45 AM – 12:30 PM: Session 4 (Production Agent Tracing & Cost)',
      '• 12:30 PM – 1:00 PM: Q&A and Community Discussion',
      '• 1:00 PM – 2:00 PM: Lunch (Provided to all attendees) 🍕',
      '• 2:00 PM – 4:15 PM: Hands-on Afternoon Hackathon 💻',
      '• 4:15 PM – 5:00 PM: Hackathon Presentations & Wrap-up',
      '',
      'Prerequisites & What to Bring:',
      '• Bring your laptop and charger.',
      '• Install OpenCode before attending: https://opencode.ai/',
      '',
      'Important Links:',
      '• Meetup RSVP: https://www.meetup.com/aiyatra/events/317425521/',
      '• Mandatory Security Pass Form: https://forms.gle/QqPNKqavEGK7phjG9',
      '• WhatsApp Discussion Group: https://chat.whatsapp.com/GWXTDtGjIs99fDtUGKJy5J?mode=gi_t'
    ].join('\n'),
    featured_note: 'Deep-dive into real-world LLM observability inside LSEG Hyderabad with hands-on afternoon hackathon, free lunch, and Grafana community perks. Make sure to fill the mandatory Google Form!',
    verified: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c0de0088-2911-477b-91c8-89c2e08a0008',
    slug: 'build-with-ai-agents-codex-hyderabad',
    title: 'Build with AI Agents: Hyderabad Codex Community Meetup',
    type: 'meetup',
    start_at: '2026-11-29T10:00:00+05:30',
    end_at: '2026-11-29T15:30:00+05:30',
    venue_name: 'Hyderabad, Telangana (Venue revealed to approved attendees via Luma)',
    venue_map_url: 'https://maps.google.com/?q=HITEC+City+Hyderabad',
    city: 'Hyderabad',
    mode: 'in_person',
    fee_text: 'Free (Approval Required)',
    is_free: true,
    eligibility: 'AI Builders, Full-Stack Engineers, Founders & Developers passionate about AI Agents',
    team_size: 'Individual',
    prize: 'Live Coding Agent Demos, Swags, Free Lunch & Beverages',
    organizer: 'OpenAI Codex Community (Supported by UiPath & Entire.io)',
    register_url: 'https://luma.com/t9h1gvc4?tk=yOECTw',
    deadline_at: '2026-11-29T09:00:00+05:30',
    reel_url: null,
    reel_code: '08',
    poster_url: '/posters/build-with-ai-agents-codex-hyderabad.jpg',
    description: [
      'Join the Hyderabad Codex Community for "Build with AI Agents" — an exclusive, hands-on developer meetup dedicated to the next frontier of autonomous coding agents, multi-agent frameworks, and shipping production software with AI.',
      '',
      'Event Highlights:',
      '• 🤖 Autonomous Coding Agents: Deep dives into building and deploying agentic workflows with OpenAI Codex and cutting-edge agent tools.',
      '• 🚀 Live Build & Ship: Interactive sessions showcasing practical agent integrations from concept to deployed application.',
      '• 🤝 Partner Ecosystem: Supported by UiPath and Entire.io with industry leads sharing real enterprise agent implementations.',
      '• 🍕 Community Perks: Exclusive community swags, developer networking, and complimentary lunch & drinks.',
      '',
      'Event Details:',
      '• Date: Sunday, 29 November 2026',
      '• Time: 10:00 AM – 3:30 PM IST',
      '• Location: Hyderabad, Telangana (Exact venue released to approved attendees via Luma confirmation)',
      '',
      'Registration:',
      '• RSVP on Luma: https://luma.com/t9h1gvc4?tk=yOECTw',
      '• Note: Spots are limited to ensure hands-on interaction. Registrations are subject to host approval.'
    ].join('\n'),
    featured_note: 'Official Hyderabad Codex Community meetup supported by UiPath and Entire.io. Learn how to build and orchestrate autonomous AI agents with hands-on live demos, free lunch & swags.',
    verified: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function run() {
  for (const event of events) {
    const { data, error } = await supabase
      .from('events')
      .upsert(event, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error upserting ${event.slug}:`, error);
      process.exit(1);
    }
    console.log(`Successfully upserted: ${event.title}`);
  }
  console.log('All events upserted into Supabase successfully!');
}

run();
