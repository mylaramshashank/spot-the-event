# Spot the Event

Hyderabad-focused hub for hackathons, meetups, and workshops.

**Product flow:** Instagram reel → link in bio → this site → search the event → open the **official** registration link.  
No AutoDM bots. Content, details, and registration in one place.

Curated by [@buildwithshashankk](https://www.instagram.com/buildwithshashankk/) · Built by [Venlix](https://venlix.tech).

---

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- Local persistence via `localStorage` (demo/admin CRUD) with optional **Supabase** schema
- Optional **Resend** email for suggestion notifications

## Product pages

| Route | Purpose |
| --- | --- |
| `/` | Brand-first hero + upcoming board |
| `/events` | Search, filters, week grouping |
| `/events/[slug]` | Detail, register CTA, share/copy, calendar |
| `/hackathons` | Hackathon track + deadline countdown |
| `/community` | WhatsApp channel join |
| `/suggest` | Full suggestion form |
| `/saved` | Device-local bookmarks |
| `/about` | Story + Venlix |
| `/admin` | Password-gated CRUD + digest + analytics |
| `/r/[code]` | Reel short-code → event redirect |

## Local setup

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Command |
| --- | --- |
| Dev | `npm run dev` |
| Production build | `npm run build` |
| Start build | `npm start` |
| Lint | `npm run lint` |
| Tests | `npm test` |

### Environment variables

See `.env.example`:

| Variable | Required | Notes |
| --- | --- | --- |
| `ADMIN_PASSWORD` | For `/admin` | Default in example: `venlix-spot-admin` |
| `ADMIN_SESSION_SECRET` | Recommended in prod | Signs admin session cookie |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Falls back to local storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side only |
| `RESEND_API_KEY` | Optional | Suggestion emails; logs to console if unset |
| `RESEND_FROM_EMAIL` | Optional | |
| `NOTIFICATION_EMAIL` | Optional | Defaults to curator email |

### Site config

Edit `src/lib/site.ts` for Instagram, Venlix, and **WhatsApp channel** invite URL (placeholder until you paste the real channel link).

## Instagram → bio → site

1. Feature an event in a reel on Instagram.
2. Point link-in-bio to this deployment (or `/r/01` short codes).
3. Visitor lands on the hero, searches the event name, opens details.
4. **Register** goes to the organizer’s official URL (Unstop, Devfolio, Luma, etc.).

## Admin

1. Visit `/admin`
2. Sign in with `ADMIN_PASSWORD`
3. Create/edit events, review suggestions, copy weekly digest, view click analytics

Data is stored in the browser (`localStorage`) unless you wire Supabase (`supabase/schema.sql`).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js** (no special `vercel.json` required; included for clarity).
4. Add env vars from `.env.example`.
5. Deploy. Set custom domain if using `spot.venlix.tech` and update `SITE.url` in `src/lib/site.ts`.

```bash
npx vercel          # preview
npx vercel --prod   # production (after login)
```

## License

Private project for Venlix / Spot the Event.
