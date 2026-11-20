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

const updates = [
  {
    slug: 'llm-observability-pretraining-to-production-aiyatra',
    description: [
      '⚠️ **MANDATORY GATE PASS RULE:** You must **RSVP on Meetup AND complete the Google Pass Form** (https://forms.gle/QqPNKqavEGK7phjG9) to enter. LSEG security will deny building entry if either is missing.',
      '',
      'Event Highlights:',
      '• **Full-Day AI Workshop & Hackathon:** In-person at **London Stock Exchange Group (LSEG)**, Madhapur, backed by **Grafana and Friends**.',
      '• **Pre & Post-Training Observability:** Gradient norms, loss dynamics, MoE expert balancing, GPU utilization, and KL divergence.',
      '• **Inference & Production:** TTFT, TPOT, GPU KV cache utilization, request costs, agent tracing, and tool-call debugging.',
      '• **Afternoon Hackathon:** Hands-on team building sprint with live presentations and technical feedback.',
      '• **Free Food & Swags:** Complimentary lunch and sponsor perks provided to all attendees.',
      '',
      'Prerequisites:',
      '• Bring your laptop and charger.',
      '• Install **OpenCode** before coming: https://opencode.ai/',
      '',
      'Important Links:',
      '• **Meetup RSVP:** https://www.meetup.com/aiyatra/events/317425521/',
      '• **Mandatory Security Pass Form:** https://forms.gle/QqPNKqavEGK7phjG9',
      '• **WhatsApp Group:** https://chat.whatsapp.com/GWXTDtGjIs99fDtUGKJy5J?mode=gi_t'
    ].join('\n')
  },
  {
    slug: 'build-with-ai-agents-codex-hyderabad',
    description: [
      '⚠️ **STRICT REGISTRATION RULE:** Seats are strictly limited. Registrations are **subject to host approval on Luma** — exact venue location in Hyderabad will be emailed only to approved attendees.',
      '',
      'Event Highlights:',
      '• **Autonomous Coding Agents:** Master agentic workflows, multi-agent frameworks, and real software generation using OpenAI Codex.',
      '• **Live Build & Ship:** Interactive sessions taking ideas from prompt to production-ready deployed web applications.',
      '• **Enterprise Sponsors:** Backed by **UiPath** and **Entire.io** with live architectural walk-throughs.',
      '• **Community Perks:** Exclusive community swags, developer networking, and free lunch & beverages.',
      '',
      'Prerequisites:',
      '• Bring your laptop and charger to build along during live demos.',
      '',
      'Important Links:',
      '• **RSVP on Luma:** https://luma.com/t9h1gvc4?tk=yOECTw'
    ].join('\n')
  },
  {
    slug: 'hack-with-hyderabad-40-microsoft',
    description: [
      '⚠️ **PARTICIPANT REQUIREMENT:** Bring your own **laptop and charger**. Open to all skill levels (individual or teams of 2 to 6).',
      '',
      'Event Highlights:',
      '• **8-Hour Offline Sprint:** Hosted in-person inside the **Microsoft Office Hyderabad** campus in Gachibowli on Friday, 18 Dec 2026.',
      '• **Internship Interviews & PPOs:** Direct access to career opportunities and Pre-Placement Offers with partner firms.',
      '• **$99 Dev Credits:** Every registered participant receives $99 worth of developer platform credits.',
      '• **Free Meals & Swags:** Free breakfast, lunch, refreshments, workshops, and exclusive event swags.',
      '• **Team Matchmaking:** Solo attendees can form teams directly on-site before the sprint begins.',
      '',
      'Important Links:',
      '• **WhatsApp Discussion Group:** https://chat.whatsapp.com/C1Rj5zxDEEOCLc2jqgY4f6'
    ].join('\n')
  },
  {
    slug: 'ai-innovate-beyond-intelligence-microsoft-epam',
    description: [
      '⚠️ **ENTRY REQUIREMENT:** Free entry with mandatory RSVP. Seats are limited on a **strict first-come, first-served basis** at the EPAM security reception.',
      '',
      'Event Highlights:',
      '• **Premier AI Summit:** Hosted inside **EPAM Systems (12th Floor, Gowra Palladium, HITEC City)** by Microsoft AI Innovators Hub.',
      '• **Technical Deep Dives:** Real-world LLM deployments, generative AI pipelines, and cloud-scale machine learning.',
      '• **Partner Communities:** Sessions led by engineers from **Microsoft, Databricks, EPAM, Synergetics, and HydPy**.',
      '• **High-Impact Networking:** Connect directly with AI architects, technical leads, and founders across Hyderabad.',
      '',
      'Important Links:',
      '• **Official RSVP:** https://www.maih.live/'
    ].join('\n')
  },
  {
    slug: 'beyond-search-to-sell-2-piperocket-google',
    description: [
      '⚠️ **STRICT ACCESS RULE:** Closed-door executive session. Attendance requires **prior approval on Luma** for building security access into the Google Hyderabad Office.',
      '',
      'Event Highlights:',
      '• **Inside Google Office:** Exclusive session at **Google Hyderabad (DivyaSree Omega, Kothaguda)** hosted by PipeRocket and Google.',
      '• **Audience:** Curated for B2B SaaS founders, growth marketers, and demand generation leaders.',
      '• **Core Topics:** Google Ads for high-intent pipeline, AI search optimization (AEO/GEO), and AI vs. human deal conversion.',
      '• **Networking & Perks:** Co-founder fireside chat, complimentary high tea, and direct networking.',
      '',
      'Important Links:',
      '• **RSVP on Luma:** https://luma.com/8lc47mnc?tk=ElU71B'
    ].join('\n')
  }
];

async function run() {
  for (const item of updates) {
    const { error } = await supabase
      .from('events')
      .update({
        description: item.description,
        updated_at: new Date().toISOString()
      })
      .eq('slug', item.slug);

    if (error) {
      console.error(`Error updating ${item.slug}:`, error);
    } else {
      console.log(`Updated description for: ${item.slug}`);
    }
  }
  console.log('All 5 active events updated in Supabase successfully!');
}

run();
