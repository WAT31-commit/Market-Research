# Meridian — AI-Powered Market Research Platform

A market research platform: market sizing, competitor intelligence, financial
modeling, and geographic analysis in one dashboard — with AI-generated
sections that carry a confidence score and a cited source, and scores that are
computed from a transparent, explainable model rather than a black box.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Recharts** for charts, **react-leaflet** + OpenStreetMap for maps
- **Prisma** + **SQLite** for zero-config local dev (schema is Postgres-compatible — see below)
- **NextAuth v4** (credentials + JWT) for auth
- **@anthropic-ai/sdk** for AI generation, with a deterministic mock fallback when no API key is set
- **World Bank Open Data API** (free, keyless) for live population/GDP data
- **@react-pdf/renderer** and **exceljs** for PDF/Excel export

## Getting started

```bash
npm install
cp .env.example .env      # already present with sane local defaults
npx prisma migrate dev    # creates prisma/dev.db and applies the schema
npx prisma db seed        # seeds a demo user + fully-populated example project
npm run dev
```

Open http://localhost:3000 and sign in with the seeded demo account:

- **Email:** `demo@example.com`
- **Password:** `password123`

Or create a new account and project from scratch via "Get started".

### Enabling live AI generation

By default, every "Generate with AI" / "Regenerate" action produces
realistic, deterministic mock content (clearly labeled as simulated in its
source citation) so the app is fully functional with no API keys. To enable
live generation, set `ANTHROPIC_API_KEY` in `.env` and restart the dev server.

## What's implemented

- Auth (sign up / sign in), multi-project dashboard
- Guided project creation (market, country, target customer, budget, research depth)
- Executive Summary with 6 explainable scores (Overall, Opportunity, Risk,
  Competition, Demand, Profitability) and an investment recommendation
- Market tab: TAM/SAM/SOM, growth trend chart, SWOT, PESTLE, Porter's Five Forces
- Customers tab: AI-generated personas and segmentation
- Competitors tab: add/remove competitors, market share chart, benchmark cards
- Financials tab: revenue/cost projection, ROI/break-even, best/expected/worst
  scenario analysis, risk assessment, go-to-market plan
- Geography tab: live World Bank population/GDP data plotted on an interactive map
- PDF and Excel export of the full report
- Settings page with a Data Sources panel (World Bank and AI generation are
  live; enterprise sources are shown as connectable but not wired up — see below)
- Dark/light theme, responsive layout

## Deliberately out of scope for this build

This is a focused MVP, not the entire original PRD surface. Deferred to a later phase:

- Supply Chain and Digital/SEO analysis modules
- Collaboration (teams, comments, sharing, permissions, version history)
- Admin panel
- PowerPoint/Word export (PDF and Excel are implemented)
- PWA/offline support
- Live paid integrations — Statista, PitchBook, CB Insights, Crunchbase, Alpha
  Vantage. These appear in Settings → Data Sources as "not configured"; wiring
  one up means adding a fetch call in `lib/` and a `DataSourceConnection`
  lookup, following the pattern in `lib/worldbank.ts`.

## Moving to production

- **Database:** swap the `datasource` block in `prisma/schema.prisma` from
  `sqlite` to `postgresql` and point `DATABASE_URL` at Postgres (e.g. Supabase
  or Neon). No model changes are required — the schema avoids sqlite-only
  types on purpose.
- **Auth secret:** set a real `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
- **Deploy:** the app is a standard Next.js app and deploys to Vercel as-is
  (`vercel deploy`), or any Node host that runs `next build && next start`.

## Project structure

```
app/
  page.tsx                        landing page
  (auth)/signin, signup           auth pages
  (app)/dashboard                 project list
  (app)/projects/new              project creation form
  (app)/projects/[id]/...         tabbed workspace (overview/market/customers/competitors/financials/geography)
  (app)/settings                  profile + data sources
  api/...                         route handlers
components/
  ui/                             shadcn primitives
  charts/                         Recharts wrappers
  reports/                        section renderers (SWOT/PESTLE/etc.), SectionCard, citations
  maps/                           Leaflet map (client-only)
lib/
  prisma.ts, auth.ts, ai.ts, worldbank.ts, scoring.ts, pdf.tsx, excel.ts
prisma/
  schema.prisma, seed.ts
```
