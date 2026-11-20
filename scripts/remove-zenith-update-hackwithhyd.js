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

async function run() {
  // 1. Remove Zenith hackathon from Supabase
  const { data: deleteData, error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('slug', 'zenith-26-mlrit-hyderabad')
    .select();

  if (deleteError) {
    console.error('Error deleting zenith:', deleteError);
  } else {
    console.log('Deleted Zenith from Supabase:', deleteData);
  }

  // 2. Update Hack With Hyderabad 4.0 description
  const updatedDesc = [
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
    '• WhatsApp Discussion Group: https://chat.whatsapp.com/C1Rj5zxDEEOCLc2jqgY4f6'
  ].join('\n');

  const { data: updateData, error: updateError } = await supabase
    .from('events')
    .update({
      description: updatedDesc,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'hack-with-hyderabad-40-microsoft')
    .select();

  if (updateError) {
    console.error('Error updating Hack With Hyderabad 4.0:', updateError);
  } else {
    console.log('Updated Hack With Hyderabad 4.0 in Supabase successfully:');
    console.log(updateData[0]?.description);
  }
}

run();
