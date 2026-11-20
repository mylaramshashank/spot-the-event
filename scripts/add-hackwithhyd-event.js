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
  id: 'f4b8296a-5dc8-4f8a-9f5b-91d8e6c70a55',
  slug: 'hack-with-hyderabad-40-microsoft',
  title: 'Hack With Hyderabad 4.0 – Microsoft Office (Devnovate)',
  type: 'hackathon',
  start_at: '2026-12-18T10:00:00+05:30',
  end_at: '2026-12-18T18:00:00+05:30',
  venue_name: 'Microsoft Office, Building 3, Microsoft India R&D Pvt Ltd, Gachibowli, Hyderabad, Telangana 500032',
  venue_map_url: 'https://maps.google.com/?q=Microsoft+India+Development+Center+Gachibowli+Hyderabad+500032',
  city: 'Hyderabad',
  mode: 'in_person',
  fee_text: 'Free',
  is_free: true,
  eligibility: 'Open to all developers, engineering students & innovators (All Skill Levels)',
  team_size: '2–6 Members (Solo matchmaking available)',
  prize: 'Internship Opportunities with PPOs, $99 Dev Credits, Free Meals & Swag',
  organizer: 'Devnovate & Hack With India',
  register_url: 'https://devnovate.co/event/hack-with-hyderabad-40',
  deadline_at: '2026-12-17T23:59:59+05:30',
  reel_url: null,
  reel_code: '05',
  poster_url: '/posters/hack-with-hyderabad-40-microsoft.jpg',
  description: [
    'Hack With Hyderabad 4.0, presented by Hack With India and Devnovate, is an 8-hour offline hackathon hosted inside Microsoft Office Hyderabad on Friday, 18 December 2026.',
    '',
    'Event Highlights:',
    '• 🏢 Venue: Microsoft Office, Hyderabad (In-Person / Offline).',
    '• 💼 Career & PPOs: Direct access to internship opportunities with Pre-Placement Offer (PPO) potential.',
    '• 🎁 $99 Credits: Every participant receives $99 worth of developer credits.',
    '• 🍕 Perks: Free meals throughout the day, exclusive event swags, and interactive workshops.',
    '• 👥 Team Size: 2 to 6 members. Solo participants can find teammates via the Devnovate Team Formation portal.',
    '• 💻 What to Bring: Participants must bring their own laptops and chargers.',
    '',
    'Schedule & Timings:',
    '• Date: Friday, 18 December 2026',
    '• Timing: 10:00 AM – 6:00 PM IST (8 Hours Sprint)',
    '• Venue: Microsoft Office, Gachibowli, Hyderabad',
    '',
    'Important Links:',
    '• Official Registration: https://devnovate.co/event/hack-with-hyderabad-40',
    '• Team Formation Portal: https://devnovate.co/event/hack-with-hyderabad-40/team-formation',
    '• WhatsApp Discussion Group: https://chat.whatsapp.com/C1Rj5zxDEEOCLc2jqgY4f6'
  ].join('\n'),
  featured_note: 'Offline 8-hour hackathon inside Microsoft Office Hyderabad with PPO internship opportunities, $99 developer credits, free meals & swags.',
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
