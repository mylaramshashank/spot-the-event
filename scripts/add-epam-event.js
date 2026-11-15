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

const newEvent = {
  id: 'e3194a28-68f1-4db8-b572-87ad048d0a92',
  slug: 'ai-innovate-beyond-intelligence-microsoft-epam',
  title: 'AI Innovate: Beyond Intelligence – Microsoft AI Innovators Hub',
  type: 'meetup',
  start_at: '2026-11-21T09:00:00+05:30',
  end_at: '2026-11-21T17:00:00+05:30',
  venue_name: 'EPAM Systems, 12th Floor, Gowra Palladium, Silpa Gram Craft Village, HITEC City, Hyderabad, Telangana 500032',
  venue_map_url: 'https://maps.google.com/?q=EPAM+Systems+Gowra+Palladium+HITEC+City+Hyderabad+500032',
  city: 'Hyderabad',
  mode: 'in_person',
  fee_text: 'Free (RSVP Required)',
  is_free: true,
  eligibility: 'Developers, AI practitioners, researchers, tech enthusiasts & engineering students',
  team_size: 'Individual',
  prize: 'Keynotes, Technical AI Deep-Dives & Community Networking',
  organizer: 'Microsoft AI Innovators Hub',
  register_url: 'https://www.maih.live/',
  deadline_at: '2026-11-21T09:00:00+05:30',
  reel_url: null,
  reel_code: '06',
  poster_url: '/posters/ai-innovate-beyond-intelligence-microsoft-epam.jpg',
  description: [
    'Welcome to AI INNOVATE | BEYOND INTELLIGENCE, a premier in-person AI summit organized by Microsoft AI Innovators Hub in collaboration with EPAM Systems, Microsoft, Synergetics Learning, Databricks, and Rinav Tech.',
    '',
    'Bringing together technology enthusiasts, developers, AI practitioners, and innovators to explore the rapidly evolving world of Artificial Intelligence.',
    '',
    'Event Highlights:',
    '• Keynotes & Technical Deep Dives: Real-world AI architectures, LLM applications, generative AI workflows, and cloud-scale machine learning.',
    '• In-Person at EPAM Systems: Experience the new EPAM campus in Gowra Palladium, HITEC City.',
    '• Industry Networking: Connect with AI leads, engineers, and founders across Microsoft, Databricks, EPAM, and Hyderabad tech communities.',
    '• Partner Communities: Hyderabad Python Users Group (HydPy), Hyderabad Data & AI Community, Microsoft Power Innovators, and Global AI Community.',
    '',
    'Event Schedule & Timings:',
    '• Date: Saturday, 21st November 2026',
    '• Time: Starts at 9:00 AM IST',
    '• Venue: EPAM Systems, 12th Floor, Gowra Palladium, Silpa Gram Craft Village, HITEC City, Hyderabad 500032',
    '',
    'Registration:',
    'Participation is completely FREE (RSVP required via official site). Seats are limited on a first-come, first-served basis.'
  ].join('\n'),
  featured_note: 'Full-day in-person AI summit inside EPAM Systems (Gowra Palladium, HITEC City) presented by Microsoft AI Innovators Hub with Microsoft, Databricks, Synergetics, and HydPy.',
  verified: true,
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

async function run() {
  const { data, error } = await supabase
    .from('events')
    .upsert(newEvent, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('Supabase Upsert Error:', error);
    process.exit(1);
  }
  console.log('Successfully upserted event into Supabase:');
  console.log(data);
}

run();
