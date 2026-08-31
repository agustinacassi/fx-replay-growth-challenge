# Analytics Plan

## Approach — analytics as part of the product

Instrumentation was designed alongside the UI, not bolted on afterward. Two constraints held throughout:

1. **The type system is the doc.** `lib/analytics/events.ts` defines every event and its exact props shape. Invalid names or malformed props fail at compile time — the failure mode that most product-analytics setups suffer (drift between "what we say we track" and "what actually fires") is prevented structurally.
2. **The reviewer must see the instrumentation without external accounts.** `lib/analytics/track.ts` wraps PostHog with a `console.info('[analytics]', event, props)` fallback so a clone-and-run reviewer observes the same events in DevTools that a production visitor sends to PostHog. Same code, different sink.

## Tooling

**PostHog Cloud (US)** — one platform for events, funnels, feature flags, and downstream product analytics. Chosen over the alternatives for three reasons:

- **Feature flags in the same SDK** — the A/B experiment ships without a second tool (GA4 would have required GrowthBook or LaunchDarkly on top).
- **Lower setup surface** — no Tag Manager, no server-side conversion config, no export pipeline to a warehouse.
- **Dev-observable** — verifying the pipeline is `curl POST /capture` returning `200`, not a 24-hour GA4 sampling delay.

**Configuration decisions** (`components/PostHogProvider.tsx`):

| Setting | Value | Rationale |
|---|---|---|
| `autocapture` | **off** | Semantic events only. No `$autocapture` noise polluting funnels. |
| `session_recording` | **off** | Not needed at this scope; +50-80kb JS; privacy consideration. In production, on for drop-off debugging. |
| `capture_pageview` | **off** | We emit named events (`landing_viewed` / `signup_viewed` / `welcome_viewed`) so funnels use semantic step names. |
| `capture_pageleave` | on | Powers bounce-rate as a guardrail metric. |
| `persistence` | localStorage+cookie | Stable `distinct_id` across reloads. |
| host | `us.i.posthog.com` | US Cloud. |

**Consent** — no banner in this scope. Documented in [trade-offs.md](./trade-offs.md); in production with EU traffic we would gate `posthog.capture` behind an opt-in.

## Event taxonomy

11 events, tipped in `lib/analytics/events.ts`. Shared enums (`Provider`, `Variant`, `CtaLocation`) prevent typo drift.

### Funnel events

| Event name | Trigger | Properties | Session context |
|---|---|---|---|
| `landing_viewed` | Landing page mounts (`components/landing/PageviewTracker.tsx`) | `variant`, `utm_source?`, `referrer?` | Anonymous `distinct_id` (PostHog-generated) |
| `cta_clicked` | Click on any `<CtaLink>` — hero, sticky nav, header, features section, footer | `location` (union of `hero`, `sticky_nav`, `features`, `footer`, `inline`, `header_secondary`, `header_cta`), `label`, `variant`, `destination` | Anonymous |
| `signup_viewed` | `/signup` mounts (`components/signup/SignupViewedTracker.tsx`) | `variant`, `from_location?` | Anonymous |
| `signup_started` | First focus on any signup form field (fires once per mount via `useRef` guard) | `provider` (`email` \| `google`), `variant` | Anonymous |
| `signup_submitted` | Just before `POST /api/users` | `provider`, `variant` | Anonymous |
| `signup_succeeded` **← primary conversion event** | 2xx response from the Users API | `provider`, `variant`, `user_id` (Notion page id) | Anonymous → linked via `identify()` |
| `signup_failed` | Non-2xx response, fetch throw, or client-side validation failure | `provider`, `variant`, `error_code`, `stage` (`validation` \| `network` \| `api`) | Anonymous |
| `welcome_viewed` | `/welcome` mounts (`components/welcome/WelcomeContent.tsx`) | `user_id`, `provider`, `variant` | Authenticated (`distinct_id === user_id` after `identify()`) |

### Diagnostic / meta events

| Event name | Trigger | Properties | Purpose |
|---|---|---|---|
| `welcome_next_step_clicked` | Click on one of the 3 next-step cards on `/welcome` | `step`, `user_id` | Early activation signal — in production would link to `first_backtest_started` |
| `faq_toggled` | Open / close a `<details>` in the FAQ | `question`, `opened` (bool), `variant` | Engagement signal — a spike in FAQ opens in a variant means that variant leaves the audience with more questions |
| `experiment_variant_assigned` | First time `getVariant()` resolves a PostHog flag in a session (fires once per flag per session) | `flag_key`, `variant` | Attribution audit — lets us verify the split is stable per `distinct_id` |

Additionally, `identify(user_id, { provider, variant })` runs on `/welcome` mount to link the anonymous pre-signup session to the authenticated `user_id`.

## Conversion funnel

```
┌────────────────────────┐
│    landing_viewed      │ ← funnel entry
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│      cta_clicked       │  (hero | sticky_nav | features | header_cta …)
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│    signup_viewed       │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│    signup_started      │  (intent signal — first field focus)
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│   signup_submitted     │
└────────────┬───────────┘
             │
        ┌────┴────┐
        ▼         ▼
┌───────────┐  ┌──────────────┐
│ succeeded │  │  failed      │ ← branched by `stage`
└─────┬─────┘  └──────────────┘
      │
      ▼
┌────────────────────────┐
│    welcome_viewed      │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│welcome_next_step_clicked│ ← activation proxy
└────────────────────────┘
```

**Primary conversion event:** `signup_succeeded`.

**Primary conversion metric:** **CVR = `signup_succeeded` / `landing_viewed`**, sliced by `variant`.

**Secondary metrics** (available in PostHog Insights out of the box because everything is tipped):

- CTA click-through rate — `cta_clicked` / `landing_viewed`, broken down by `location` to see which CTA does the work.
- Form completion rate — `signup_succeeded` / `signup_started` — signals form friction.
- Bounce rate — sessions with `landing_viewed` but no `cta_clicked`.
- FAQ engagement rate — sessions with any `faq_toggled` / `landing_viewed`.

## Data quality — how we ensure the numbers are trustworthy

Nine safeguards, layered:

1. **TypeScript strict** — `Events` type in `lib/analytics/events.ts` gates every `track()` call at compile time. Invalid event name or missing prop → `tsc --noEmit` fails. Enforced by the pre-commit typecheck hook (`.claude/settings.json`).
2. **Enum-typed props** — `Provider`, `Variant`, `CtaLocation` are string-literal unions. `provider: 'gogle'` (typo) fails at compile.
3. **`autocapture` off** — semantic events only; no noise from icon clicks or default `<a>` behavior polluting funnels.
4. **Manual pageviews** — `landing_viewed`, `signup_viewed`, `welcome_viewed` instead of the generic `$pageview` — funnels use meaningful names.
5. **Persistence: localStorage + cookie** — stable `distinct_id` across reloads. PostHog handles sessioning natively.
6. **`identify()` post-signup** — the Notion page id becomes the person key. All events pre-signup → post-signup for the same session are stitched to one person in PostHog Insights.
7. **Dedupe** — PostHog client generates a UUID per event; server-side dedup on retries.
8. **`experiment_variant_assigned` as audit signal** — fires once per flag per session. Confirms the split is stable per user (a user always sees the same variant).
9. **No PII in the analytics endpoint** — only `user_id` (opaque Notion page id) and `provider`. Email and name go only to Notion, not PostHog.

## Adding a new event — the `/add-tracked-event` workflow

The `.claude/commands/add-tracked-event.md` command enforces that every new event flows through:

1. Add the event definition to `lib/analytics/events.ts` (typed).
2. Add its row to this document (the taxonomy table above).
3. Return the exact `track()` snippet to paste at the trigger site.
4. Run `tsc --noEmit` to verify.

The command prevents the classic drift where the doc says "we track X" but the code fires it with different props (or not at all).

## Verification

**Live verification of the pipeline** during development:

```bash
KEY=$(grep NEXT_PUBLIC_POSTHOG_KEY .env.local | cut -d= -f2)
curl -X POST https://us.i.posthog.com/capture/ \
  -H "Content-Type: application/json" \
  -d "{\"api_key\":\"$KEY\",\"event\":\"test\",\"distinct_id\":\"cli-test\"}"
# → 200 OK
```

**End-to-end verification** (Notion + PostHog together) is documented in the [README](../README.md) — after signup, the row appears in the Notion database in real time, and all funnel events appear in PostHog → Activity within seconds.

## What we would add with more time

- **Cohort analysis** — retention D1 / D7 / D30 by variant + provider.
- **Segment by traffic source** — paid vs. organic vs. referral, since intent shape differs.
- **`first_backtest_started`** — the activation event that closes the loop between signup and first real value. Required to compute time-to-first-value.
- **Retry queue for events** — service worker + IndexedDB to reintent failed captures during a PostHog outage.
- **PostHog server-side SDK** for critical events (`signup_succeeded`) — client-side capture drops during navigation are a known data-quality hazard.
- **Automated instrumentation tests** — Playwright E2E that asserts every user path produces the expected event sequence.
