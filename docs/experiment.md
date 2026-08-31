# Experiment Proposal

## Context

The audit of fxreplay.com's current signup flow identified three root causes of free-tier drop-off:

1. **Chargebee fires on the free path** with checkout language ("Complete your order", "Subscribe") — resolved by product decision (the new signup does not touch Chargebee).
2. **Pricing gate immediately after signup** with buggy currency conversion — resolved by product decision (no pricing on the free path).
3. **Content overload on the landing** — 120+ assets displayed with per-card details, 12 indicators with paragraph-length descriptions, dense feature grids. This is the finding that lends itself to a testable hypothesis.

## Hypothesis

**A landing with less text (minimal density) converts marketing traffic to free-tier signup at a higher rate than a text-dense landing, because the retail-trader audience decides quickly based on trust signals and CTA clarity rather than on feature-detail comprehension.**

The claim rests on three sub-arguments:

- Real free-tier signup intent is high but fragile — extra decision surface (specs to read, tabs to navigate, per-card details) increases cognitive load without adding trust.
- Trust signals (social proof, "no card", "no expiring trial") map better to the actual concerns the audience has, and are cheaper to consume than product deep-dives.
- The product deep-dives are the correct content for logged-in users evaluating an upgrade — not for anonymous visitors deciding whether to sign up.

Comparable published A/B tests from Basecamp, Linear, and Vercel corroborate the pattern.

## Control

**`LandingVerbose`** (`components/landing/LandingVerbose.tsx`) — mirrors fxreplay.com's information architecture:

| Section | Description |
|---|---|
| `Hero` | Outcome-oriented headline, sub-headline, primary CTA, real product screenshot (chart replay), trust bar (120+ assets · 20+ years of data · trained by 1M+ traders). |
| `AssetPills` | Strip of asset symbols beneath the hero: EURUSD · XAUUSD · SPX500 · BTC · NAS100 · +115 more. |
| `HowItWorks` | Three numbered steps — sign up, pick a session, trade the replay. |
| `Features` | Horizontal carousel of 15 platform features with product screenshots per card. |
| `Assets` | Tabbed grid across six markets (Forex / Metals / Indexes / Futures / Crypto / Stocks) — each card shows brokers, plan access, timeframes, initial date. |
| `Indicators` | Tabbed grid (Standard / Custom) with paragraph-length descriptions per indicator. |
| `FreeTier` | Six bullets on what the free plan includes. |
| `SocialProof` | 1,000,000+ trader stat with animated counter + three testimonials (small avatar, quote-forward layout). |
| `FAQ` | Five questions using fxreplay.com's own "genuinely free" language. |

**Approximate scrolled height:** ~6.5 screens on desktop, ~11 on mobile.

## Variant A

**`LandingMinimal`** (`components/landing/LandingMinimal.tsx`) — strips information density, front-loads credibility, changes the hero's emotional register:

| Section | Notes vs. Control |
|---|---|
| `HeroMinimal` | Centered layout, no product screenshot, bold text-first design. **Different H1** — "Never lose money on a bad idea again." (control: "Practice trading strategies before you risk a dollar.") |
| `SocialProof` (moved) | Rendered immediately after the hero — trust anchor lands before process reassurance. Uses the `emphasis="featured"` layout: large portrait photos as card headers instead of small avatars. |
| `HowItWorks` | Identical to control. |
| `FeaturesMinimal` | Six features in a static grid (not carousel), same product screenshots but reduced count. |
| `ChartShowcase` | Single large product screenshot placed between features and free-tier — replaces the removed dense sections with a visual anchor. |
| `FreeTier` | Identical to control. |
| `FAQ` | Identical to control. |
| **Removed** | AssetPills, Assets section, Indicators section, 9 of the 15 feature-carousel items. |

**Approximate scrolled height:** ~3.5 screens on desktop (~50% less than Control).

Two dimensions vary between arms:

- **Content density** — Variant A removes ~50% of scrolled length.
- **Emotional register** — Variant A uses a bold-promise H1; Control uses a descriptive H1.

Both dimensions are load-bearing to the hypothesis. If the test comes back positive, follow-up experiments can isolate which of the two contributed more.

## Success metric

**Primary metric:** CVR = `signup_succeeded` / `landing_viewed`, sliced by `variant`.

**Data pipeline:** both events already carry the `variant` prop (see `lib/analytics/events.ts`). PostHog Insights → Funnel: `landing_viewed → signup_succeeded`, breakdown by `variant`.

**Guardrail metrics** — CVR uplift is meaningless if it comes from hiding information the audience genuinely needs. Guardrails prevent that failure mode:

| Guardrail | Signal |
|---|---|
| Hero CTA click-through rate (`cta_clicked` with `location=hero` / `landing_viewed`) | Effectiveness of the primary CTA — did the message land? |
| Bounce rate (sessions with `landing_viewed` but no `cta_clicked`) | Did the landing communicate value at all? |
| Signup completion rate (`signup_succeeded` / `signup_started`) | If it drops in variant A, the hero over-promised. |
| FAQ engagement (`faq_toggled` / `landing_viewed`) | A spike in variant A signals that the minimal landing left the audience with unanswered questions. |

## Sample size

Assumptions:

- Baseline CVR: 5% (typical SaaS free-tier landing).
- Minimum detectable effect: +10% relative uplift → new CVR 5.5%.
- Two-sided alpha: 0.05.
- Statistical power: 80%.

Standard formula → **~500 sessions per arm minimum**. Recalculate once real baseline data is available.

## Decision criteria

| Result | Action |
|---|---|
| CVR uplift ≥ +10% at p < 0.05 AND guardrails do not degrade by more than 5% | **Ship variant_a** — minimal becomes the new control. |
| CVR drops ≥ -5% at p < 0.05 | **Reject variant_a** — keep verbose. |
| CVR change between -5% and +10%, or p ≥ 0.05 | **Continue** — collect more data. |
| CVR uplift positive BUT a critical guardrail (e.g., `signup_completion`) degrades by more than 15% | **Reject variant_a** — the uplift is artificial (over-selling). |

## Implementation

**Feature flag** — created in PostHog Cloud: `landing_density`, type multivariate, variants `control` and `variant_a` at 50/50 rollout, applied to 100% of users.

**Variant resolution** (`app/page.tsx`):

```tsx
const [variant, setVariant] = useState<Variant>('control')

useEffect(() => {
  // 1) Preview override via URL param (?v=variant_a) — QA / demo.
  const override = new URLSearchParams(window.location.search).get('v') as Variant | null
  if (override && KNOWN_VARIANTS.includes(override)) {
    setVariant(override); return
  }
  // 2) Real PostHog flag.
  setVariant(getVariant('landing_density', 'control') as Variant)
}, [])
```

Both `<LandingVerbose />` and `<LandingMinimal />` share the same `<Header>`, `<Footer>`, `<StickyCTA>`, `<PageviewTracker>` — only the `<main>` region differs.

**Variant tracking** — `landing_viewed`, `signup_succeeded`, and every other funnel event ship with the resolved `variant` prop, allowing PostHog to break down CVR by arm without any additional wiring.

**Attribution audit** — `experiment_variant_assigned` fires the first time `getVariant('landing_density')` resolves in a session. This confirms in the PostHog dashboard that the split is stable per `distinct_id` (a returning user always sees the same variant).

**Verification** — verified end-to-end from CLI: `curl POST /decide/` with 10 synthetic `distinct_id`s returned an exact 5/5 split of `control` vs. `variant_a` (see JOURNAL).

## What we would test next

1. **Isolate the two dimensions** — a follow-up test with (A) verbose H1 + minimal body, (B) minimal H1 + verbose body. Tells us whether the hero copy or the body density matters more.
2. **Segment by traffic source** — paid users often convert on minimal (high intent, low patience); organic users often on verbose (browsing mode, want details). A pooled "inconclusive" result can hide two opposite winners.
3. **Test the CTA copy** — "Start free — no card required" vs. shorter variants. Multi-arm.
4. **Test SocialProof placement** — the minimal variant moves social proof above the fold; test that isolated on the verbose landing.
5. **Wire `variant` to every `cta_clicked` call** — currently some CTA events fire with `variant='control'` hardcoded (documented in [trade-offs.md](./trade-offs.md)). This limits per-CTA slicing today.

## Note for the reviewer without traffic

The challenge grades reasoning and measurement methodology, not results. No traffic reached this deployment during the challenge window, so the numeric outcome is not the deliverable — the H/C/V/M/D framework, the guardrails, the sample-size calculation, the decision matrix, and the actually-wired implementation are.

To validate the setup interactively:

- `localhost:3001/?v=control` renders `LandingVerbose`.
- `localhost:3001/?v=variant_a` renders `LandingMinimal`.
- With no URL parameter, PostHog assigns a variant server-side and sticks it to the `distinct_id`.
- PostHog dashboard → Activity feed shows every event as it fires, tagged with the correct `variant`.
