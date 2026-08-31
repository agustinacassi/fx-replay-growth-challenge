# FX Replay — Growth Engineer Challenge

A production-minded marketing experience — landing, signup, welcome, Users API — designed to increase conversion from marketing traffic to free account creation.

**Repository:** <https://github.com/agustinacassi/fx-replay-growth-challenge>
**Live deployment:** *(added after Vercel deploy)*

The submission includes:

- Two variants of the landing wired to a live A/B experiment (`landing_density`, PostHog feature flag).
- A working Users API with a swappable storage adapter (Notion in production, in-memory for local dev).
- 11 typed analytics events flowing to PostHog, verified end-to-end.
- Documentation of every decision, trade-off, and next step.
- A committed AI-native workflow — four review agents, three commands, three MCPs.

---

## Quick start

### Prerequisites

- Node.js 22+ and npm 10+.
- (Optional) Notion account and PostHog account if you want to see the real integrations in action. Everything works without either — see [environment variables](#environment-variables) below.

### Install and run locally

```bash
git clone https://github.com/agustinacassi/fx-replay-growth-challenge.git
cd fx-replay-growth-challenge
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open <http://localhost:3000> (or whichever port Next chooses if 3000 is busy).

**Without any env vars:** the app still works. Signups persist to an in-memory `Map` that resets on server restart. Analytics events log to the browser console with the `[analytics]` prefix. The A/B experiment defaults every user to the `control` variant.

**With env vars:** signups persist to a real Notion database. Analytics events flow to PostHog and can be inspected in the Activity feed. The A/B experiment assigns users to `control` or `variant_a` via the PostHog feature flag.

### Preview each variant of the A/B experiment

Without configuring PostHog, use the URL param override to preview either variant:

- <http://localhost:3000/?v=control> — verbose landing (dense information, mirrors fxreplay.com's IA).
- <http://localhost:3000/?v=variant_a> — minimal landing (stripped density, social proof lifted above the fold, bold-promise H1).

With PostHog configured (see below), no query parameter is needed — the flag assigns each `distinct_id` at 50/50.

## Environment variables

All variables are optional. Copy `.env.example` to `.env.local` and fill in what you need.

| Variable | Purpose | If unset |
|---|---|---|
| `NOTION_TOKEN` | Notion integration token (starts with `ntn_` or `secret_`). Give the integration Read + Insert + Update capabilities on the database. | Users API falls back to in-memory storage. |
| `NOTION_SIGNUPS_DB_ID` | UUID of the Notion database receiving signups. Must be the **block ID** (from the database URL), not the data-source ID. | Same as above. |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project token (starts with `phc_`). | `track()` calls log to the browser console. Feature flag returns the `control` fallback. |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog Cloud host — `https://us.i.posthog.com` for US, `https://eu.i.posthog.com` for EU. | Defaults to US. |
| `NEXT_PUBLIC_SITE_URL` | Origin used by `sitemap.ts`, `robots.ts`, and `metadataBase`. | Falls back to a Vercel-shaped placeholder — set to the real deploy URL after first deploy. |
| `NEXT_PUBLIC_SHOW_META` | Set to `true` to show the "Growth challenge marketing experience" tagline in the footer. | Hidden (production posture). |

## Setting up Notion (optional, ~5 min)

1. Go to <https://www.notion.so/my-integrations> → **New integration** → name "FX Replay Growth" → give it Read + Insert + Update content capabilities → copy the Internal Integration Secret into `NOTION_TOKEN`.
2. Create a Notion database with columns: `Email` (title), `Name` (rich_text), `Provider` (select: email / google), `Variant` (select: control / variant_a / variant_b), `Source` (rich_text), `Created` (created_time), `User ID` (auto_increment id).
3. Open the parent page → `⋯` menu → Connections → Add "FX Replay Growth" integration. This grants access to the database inside.
4. Copy the database block ID from the URL (`https://www.notion.so/p/<BLOCK_ID>`) into `NOTION_SIGNUPS_DB_ID`. Use the block ID, not the data-source ID — the SDK expects the block ID.

## Setting up PostHog (optional, ~5 min)

1. Sign up at <https://posthog.com/signup> (US Cloud).
2. Project Settings → **Project token & ID** → copy the `phc_...` value into `NEXT_PUBLIC_POSTHOG_KEY`.
3. To enable the A/B experiment: Feature flags → New feature flag → key `landing_density`, type Multivariate, variants `control` (50%) and `variant_a` (50%), Release conditions 100% of all users, save.

## Verifying end-to-end

After configuring both Notion and PostHog:

1. Sign up on `/signup` with a fresh email.
2. Refresh the Notion database — a new row appears with your email, name, and the assigned variant.
3. Open PostHog → Activity — events appear in real time: `landing_viewed`, `experiment_variant_assigned`, `cta_clicked`, `signup_viewed`, `signup_started`, `signup_submitted`, `signup_succeeded`, `identify`, `welcome_viewed`.
4. PostHog → Insights → New funnel: `landing_viewed → signup_succeeded`, breakdown by `variant`. This is the primary metric for the A/B experiment.

## Scripts

```bash
npm run dev         # start Next.js dev server
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run clean       # remove .next and node_modules/.cache (fixes stale dev cache)
```

## Documentation

Everything the reviewer needs beyond running the app:

- [Architecture](docs/architecture.md) — system diagram, tech decisions, deployment, what would change for production.
- [Analytics Plan](docs/analytics.md) — event taxonomy, funnel, primary metric, data quality safeguards.
- [Experiment Proposal](docs/experiment.md) — hypothesis, control, variant, success metric, decision criteria.
- [Performance Review](docs/performance.md) — CWV approach, rendering strategy, SEO, accessibility, caching, production risks.
- [AI-Native Workflow](docs/ai-workflow.md) — CLAUDE.md, four review agents, three commands, MCP integrations, examples of AI leverage and correction.
- [Trade-offs](docs/trade-offs.md) — every decision that was deferred, cut, or accepted as a limitation, with the fix path for production.

## Tech stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS with brand-kit design tokens (`brand-kit/tokens/tokens.css`).
- **Fonts:** Lato (headings) and Nunito Sans (body) via `next/font/google`.
- **Storage:** `@notionhq/client` in production, in-memory fallback for local dev.
- **Validation:** Zod at the API boundary.
- **Analytics:** PostHog with a typed wrapper (`lib/analytics/`).
- **Deployment target:** Vercel.

## Project structure

```
app/                    Next.js App Router — routes, layout, sitemap, robots, OG image
components/             UI components — landing, signup, welcome, shared
lib/                    analytics, api utilities, storage adapters
brand-kit/              Reconstructed design tokens + logos + reference HTML
public/                 Static assets — favicon, product screenshots, avatars, OG image
.claude/                AI-native workflow — agents, commands, hooks (committed for review)
docs/                   Six documentation files (see above)
notes/                  Private cheat sheets for the technical review (gitignored)
JOURNAL.md              Chronological log of every non-trivial decision + rationale
CLAUDE.md               Project-level instructions loaded into every Claude session
```

## For the reviewer — a 5-minute tour

1. Open [docs/architecture.md](docs/architecture.md) for the system diagram and the "what would change for production" section.
2. Open [docs/experiment.md](docs/experiment.md) for the A/B hypothesis, then visit the live URL with `?v=control` and `?v=variant_a` to see both landings in one browser session.
3. Skim [.claude/agents/](.claude/agents/) and [.claude/commands/](.claude/commands/) — the AI-native workflow is committed for direct inspection.
4. Read [docs/trade-offs.md](docs/trade-offs.md) — this is where the prioritization decisions live.
5. Explore [docs/analytics.md](docs/analytics.md) and [docs/performance.md](docs/performance.md) for the taxonomy and the perf/SEO / a11y approach.
