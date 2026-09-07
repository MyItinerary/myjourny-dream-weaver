# myjourny-dream-weaver

The pre-launch waitlist page for **MyJourny** — "Travel Experiences Tailored to You." Standalone from the rest of the MyJourny codebase.

## Problem

Finding an authentic, local-led travel experience is harder than it should be. Generic listing sites and map apps surface the same crowded landmarks and stale reviews, with no reliable way to tell which local guides are trustworthy, available, and worth paying. On the other side, local guides have no real marketplace: no easy way to list an experience, get discovered by the right traveller, take a booking, and actually get paid — so a lot of great local expertise never reaches the travellers who'd pay for it.

## Value proposition

MyJourny connects travellers with vetted local guides for bookable, curated experiences — verified guides, integrated payments and payouts, and semantic discovery, replacing generic listings with real local expertise.

This site's job isn't to deliver that product — it's to validate demand for it before building further. It's a landing page pitching personality-driven, authentic local travel discovery (initial focus: Lagos & Abuja) with a waitlist signup that doubles as a research instrument: the signup form captures each respondent's travel pain points, how they currently find local experiences, what they'd use the product for, and — notably — whether they'd be interested in hosting/guiding themselves. That's both a lead list for launch and an early read on demand for the guide side of the marketplace.

## Standalone by design

Unlike every other MyJourny repo, this one does **not** call the [`itin`](https://github.com/MyItinerary/itin) API. It has its own Supabase project (`supabase/` — migrations for a `waitlist_signups` table) for capturing signups directly. Treat it as an independent codebase; nothing here touches Stripe/Paystack or the shared JWT auth used elsewhere.

## Tech Stack

TanStack Start (React) · Vite · TypeScript · Tailwind CSS v4 · Radix UI / shadcn-style components · Supabase (`@supabase/supabase-js`) · deployed on Vercel · bun for package management

Originally scaffolded with [Lovable](https://lovable.dev) (see `.lovable/`).

## Getting Started

```bash
bun install
bun run dev
```

### Environment variables

Create a `.env` file (git-ignored) with your Supabase project's credentials — names only, get the values from your own Supabase project settings:

```
SUPABASE_URL=
SUPABASE_PROJECT_ID=
SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
NITRO_PRESET=
```

## Project Structure

```
myjourny-dream-weaver/
├── src/
│   ├── routes/            # TanStack Router file-based routes (index = landing page)
│   ├── components/        # Landing page sections + ui/ (shadcn-style primitives)
│   ├── integrations/
│   │   └── supabase/      # Supabase client
│   ├── hooks/
│   └── lib/
├── supabase/
│   ├── config.toml
│   └── migrations/        # waitlist_signups schema
└── scripts/                # Build/deploy helper scripts
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Production build |
| `bun run build:dev` | Development-mode build |
| `bun run preview` | Preview a production build locally |
| `bun run lint` | Lint with ESLint |
| `bun run format` | Format with Prettier |

## Deployment

Deployed on Vercel; the build runs `bun run build && node scripts/vercel-postbuild.mjs` (see `vercel.json`).
