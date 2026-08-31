# Trade-offs

The challenge grades prioritization and trade-offs, not feature completeness. This document lists every non-obvious decision to defer, cut, or accept a limitation — with the rationale that led to it and, where relevant, the fix path if this became a production system.

## Scope decisions — what was intentionally not built

### Authentication is simulated

The signup form creates a real Notion row, fires the correct analytics events, and redirects to a welcome page — but there is no session token, no email verification, no password reset, no login route. The `password` field is not stored; the signup does not persist a login.

**Why:** the challenge explicitly says "you do not need to recreate FX Replay's complete authentication system." Real auth would have consumed the entire budget of the challenge.

**Fix path:** NextAuth.js or Clerk for OAuth + session management; a `password_hash` column in the users table (post-Postgres migration); email verification via a transactional provider like Resend or Postmark.

### Chargebee is not integrated

The signup flow does not touch a payment provider. This is a **product decision, not a scope cut** — the whole narrative bet is that Chargebee on the free path is what leaks free-tier conversions on fxreplay.com. Documenting this in `docs/architecture.md` as a recommendation to FX Replay: Chargebee should only enter the flow when the user opts into a paid tier from inside the app, never on free signup.

### The current fxreplay.com landing is not being redesigned

The output is a **new** landing dedicated to the free tier ("Try FX Replay Free"), not a replacement homepage. The current fxreplay.com landing serves a different job (broad product discovery, pricing, features, integrations). Both would coexist in a production setup.

### Product core is not built

No backtesting engine, no session runner, no chart interaction, no trade journal. The scope is the marketing surface + signup — everything downstream of `signup_succeeded` is out.

### Automated tests are not written

No Vitest unit tests, no Playwright E2E, no axe-core CI. The pre-commit typecheck hook and manual review cycles caught issues during development. The storage adapter pattern is testable (`InMemoryStorage` is essentially a test double already); the API is Zod-validated at the boundary.

**Fix path:**
- Vitest for `lib/storage/*` and `lib/api/errors.ts`.
- Playwright for `landing_viewed → signup_succeeded → welcome_viewed` end-to-end, running on every PR.
- axe-core inside Playwright for automated a11y checks.

## Architectural limitations accepted for this scope

### Landing is client-side rendered

`app/page.tsx` is `'use client'` because the A/B variant is resolved via PostHog's JS SDK on mount. This forces the entire landing tree to hydrate (~208kB First Load JS on `/`).

**Impact:** noticeable but not blocking. LCP is still in the 2.0–2.5s range because the hero image has `priority` and the pre-hydration HTML is fully rendered.

**Fix path:** PostHog `bootstrap` from cookies — set an `ab-cohort` cookie on first visit server-side (from a lightweight middleware), then `app/page.tsx` reads the cookie in the RSC layer and returns to being a server component. Eliminates the client boundary + the variant flash on slow networks in one shot. Estimated 1–2 hours.

### Header is a shared client component

`components/landing/Header.tsx` is `'use client'` for the dropdown menus and `usePathname` (used to hide auth CTAs on `/welcome`). It ships to every page — including `/signup` and `/welcome` where the dropdowns are hidden.

**Fix path:** split into `HeaderShell` (server, renders logo + nav skeleton) and `HeaderNav` (client, only mounts the dropdown state and pathname check). ~30 minutes.

### PostHog SDK ships in the initial bundle

The `posthog-js` import chain is loaded at page level even though initialization happens in a `useEffect`. Adds ~90kB gzipped to First Load JS.

**Fix path:** `next/dynamic` the `PostHogProvider` so posthog-js only loads after LCP. Estimated 15 minutes.

## Analytics gaps

### `variant` is hardcoded `'control'` in some `cta_clicked` calls

Some `CtaLink` usages in the landing tree pass `variant='control'` because propagating the real resolved variant would require prop drilling from `app/page.tsx` down through every intermediate component (or a React context).

**Impact:** the primary conversion metric (CVR = `signup_succeeded` / `landing_viewed`, sliced by `variant`) is unaffected — both endpoints of the funnel carry the correct variant. Only the intermediate `cta_clicked` events are locally miscoded, meaning we cannot slice "which CTA converts better within variant A" from event data.

**Fix path:** React context that publishes the resolved variant, consumed by `CtaLink`. Estimated 20 minutes.

### Direct hits to `/welcome` fabricate default values

If a user opens `/welcome` without the `?u=...&p=...&v=...` query params (bookmark, refresh without params), `welcome_viewed` fires with `user_id: 'anonymous'`, `provider: 'email'`, `variant: 'control'`. These pollute the funnel.

**Impact:** analysts must filter `user_id != 'anonymous'` when computing CVR. Documented in code with a comment at the effect site.

**Fix path:** skip the event on direct hits, or add a `source: 'direct'` prop and filter server-side.

### No client-side retry queue for events

The `track()` wrapper is fire-and-forget. If PostHog is unreachable, events drop silently.

**Fix path:** service worker + IndexedDB queue that reintents failed captures. Standard pattern; not needed at this scale.

### `experiment_variant_assigned` fires once per session but not per user

The dedup is a client-side `Set` in `lib/analytics/track.ts`. Persists for the session but not across sessions or devices. In production with a large user base, this could double-count first-touch variant assignments across returning sessions.

**Fix path:** persist the flag-seen set in localStorage keyed by `distinct_id`. Minor.

## A11y items deferred

Reviewed by `a11y-reviewer` and consciously deferred:

- **Focus-restore on API error in `SignupForm`** — WCAG 2.4.3 borderline. If the API returns a validation error, focus does not move back to the first invalid field. Nice-to-have; error banner uses `role="alert"` so it is announced.
- **Full contrast audit on every token combination** — spot-checked; no failures identified against WCAG AA on the surfaces reviewed. Not enforced systematically.
- **`from_location` prop on `signup_viewed` is never populated** — would require the landing CTAs to append `?from=<location>` to the `/signup` URL. Analytics-quality gap more than a11y.

## AI-native workflow limitations

### Custom agents did not auto-register as `subagent_type` in the session

`.claude/agents/copy-critic.md`, `.claude/agents/a11y-reviewer.md`, etc. define the four review agents. In this project's Claude Code sessions, they were not automatically available as values for the `subagent_type` parameter — the sessions listed only the built-in agents (`claude`, `general-purpose`, `Explore`, etc.).

**Workaround used:** every agent invocation used `subagent_type: 'general-purpose'` with the target agent's system prompt inlined verbatim in the message. Value preserved (the agent still reviewed against the correct criteria), ergonomics worse (one message per invocation, no fanout convenience).

**Fix path:** restart the session after adding new agent files, or explicitly reload via a Claude Code command. Not investigated further under time pressure.

### Chrome MCP was not connected

`mcp__claude-in-chrome__*` tools were listed but the browser extension did not respond during the session. Fallback: WebFetch for reading external pages, curl-driven scripts for end-to-end verification.

**Fix path:** install and authorize the Chrome extension separately. Would enable click-driven signup flow verification from Claude, screenshot capture for docs, and live network / console inspection.

## Product content decisions

### Assets on the landing are pulled from fxreplay.com

Feature screenshots, testimonial avatars, and asset icons come from fxreplay.com's CDN and are self-hosted under `public/`. This is acceptable for a challenge / portfolio submission but not for production — the assets are copyright of FX Replay.

**Fix path:** original photography for testimonials, original illustrations or licensed product screenshots for features, brand-consistent original icons for assets.

### Content depth mirrors fxreplay.com by design

The verbose landing (`LandingVerbose`) is deliberately dense — mirroring fxreplay.com's information architecture (120+ assets grid, 15 features, paragraph indicator descriptions) — because it is the **control** arm of an A/B experiment testing whether that density hurts conversion. Removing content from the verbose landing before running the experiment would compromise the hypothesis.

## What we would tackle first with more time

Ranked by impact / effort ratio:

1. **Deploy to Vercel with real env vars** (~15 min) — the missing "Live deployment URL" deliverable.
2. **Server-side variant resolution via cookie bootstrap** (~1–2h) — largest single lift to CWV and eliminates the variant flash.
3. **Split `Header` into shell + island** (~30 min) — removes shared client hydration on `/signup` and `/welcome`.
4. **Vitest for the storage adapter contract** (~1h) — biggest correctness ROI, closest to production-critical.
5. **Playwright smoke test for the signup flow** (~1–2h) — regression protection for the whole funnel.
6. **Sentry integration** (~30 min) — the largest observability gap, cheapest to close.
7. **Rate limiting on `/api/users`** (~1h) — required before any real deploy.
8. **React context to propagate `variant` to every `cta_clicked`** (~20 min) — closes the analytics slicing gap.
9. **Automated Lighthouse in CI** (~1h) — CWV regression detection.
10. **Original assets for the landing** (~variable) — depends on brand + design team capacity, but required to launch under FX Replay's own name.
