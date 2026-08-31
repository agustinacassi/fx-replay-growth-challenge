# CLAUDE.md

Project-level instructions for Claude Code sessions on this repository.

## What this project is

FX Replay Growth Engineer technical challenge. A production-minded marketing experience — landing + signup + Users API — designed to increase conversion from marketing traffic to free account creation.

**Business objective**: increase conversion from marketing traffic → free account created.

**Our narrative bet**: the current fxreplay.com signup flow leaks free-tier conversions because "free" doesn't feel free — Chargebee fires on the free path with checkout language ("Complete your order", "Subscribe"), billing address is collected before value is delivered, pricing is displayed with buggy currency conversion, and the copy leads with features instead of outcomes. Our "Try FX Replay Free" experience fixes this at the top of the funnel: outcome-first copy, one-step signup with zero payment provider involvement, and an immediate welcome that confirms what the user just unlocked.

Full product audit (10 friction points, annotated) lives in the Figma linked from `docs/architecture.md`.

## Target user

Retail traders (typically self-taught, price-sensitive, skeptical of "free trials" that turn into charges) who want to practice trading strategies without risking capital. What they care about, in order:
1. Speed to first value — can I actually do a backtest today?
2. Trust — will I be charged? Will my card be asked for?
3. Understanding — what does this tool actually let me do that TradingView doesn't?

Design decisions should always favor these three, in this order.

## Scope

### In scope (build)
- Landing page at `/` — outcome-oriented copy, primary CTA, responsive, accessible, tokenized to brand kit.
- Signup flow at `/signup` (or modal from landing) — Google + email/password, one step, inline validation, no billing, no pricing gate.
- Welcome page at `/welcome` — post-signup confirmation of what was unlocked. No commitment devices, no retention overlays.
- Users API at `/api/users` — create, update, list. Called by the signup flow.
- Analytics instrumentation — every user-visible action tracked, funnel defined, taxonomy typed in `lib/analytics/events.ts`.
- One A/B experiment (implemented behind a PostHog feature flag).
- Docs: architecture, analytics, experiment, performance, AI workflow, trade-offs.

### Out of scope (documented, not built)
- Real authentication (sessions, email verification, password reset).
- Chargebee integration on the free path — this is a deliberate product recommendation: Chargebee should only enter when a user opts into a paid plan, never on free signup. Document this in `docs/architecture.md`.
- Redesigning the existing fxreplay.com landing — we are building a **new** dedicated experience for the free tier, not replacing their homepage.
- The product core (backtesting engine, sessions, indicators, journal).
- Automated tests beyond a smoke test on the storage adapter — the challenge doesn't ask for them and time is finite. Document in `trade-offs.md`.

**If a feature request appears that isn't in the "in scope" list, ASK before building it.** Time is capped at ~6 hours of effective work.

## Product source of truth

When you need to describe what FX Replay actually does — features, terminology, product screenshots — the source is **fxreplay.com** and the audit in the Figma. **Do not invent product features or claims.** If you're unsure whether a claim about the product is accurate, flag it in a comment rather than shipping fabricated copy.

We are re-packaging their product for a free-tier audience, not inventing a new product.

## Working philosophy

These are non-negotiable defaults. Deviate only when a specific instruction says otherwise.

- **No over-engineering.** Ship what the challenge asks for, well. Do not add abstractions, wrappers, config flags, or "future-proofing" that has no current need.
- **Explain before deciding.** For architecture, tooling, or product decisions — describe the choice and the trade-off in 2-4 lines and wait for confirmation. For implementation once the "what" is agreed, proceed without asking permission line by line.
- **Delegate implementation.** Agustina is not going to review code line by line. She reviews decisions, copy, product framing, analytics design, and trade-offs. Code quality is your job.
- **Trade-offs are the deliverable.** The challenge explicitly evaluates trade-offs. Every non-obvious decision should have a documented reason. When you cut scope, name it in `docs/trade-offs.md`.
- **Brand kit is a hard constraint.** Never use raw hex values. Never use fonts other than Lato (headings) and Nunito Sans (body/UI). Import from `brand-kit/tokens/tokens.css` and reference semantic tokens (`var(--bg-primary)`, `var(--text-primary)`) — never primitives.
- **No trailing summaries.** When you finish a change, state what changed in 1-2 sentences and stop. No recap of what the diff already shows.
- **Communication in Spanish.** Agustina works in Spanish. Reply to her in Spanish. Write code, docs, and commits in English (reviewers are English-speaking).

## Stack and conventions

- **Framework**: Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Deploy target**: Vercel.
- **Persistence**: storage adapter pattern in `lib/storage/`. Two implementations behind one interface:
  - `NotionStorage` (production) — Notion database as the users table.
  - `InMemoryStorage` (local dev, fallback) — RAM only, resets on restart.
  - Selection at boot: if `NOTION_TOKEN` is set, use Notion; otherwise use in-memory. Log the choice at startup.
- **Analytics**: PostHog via a thin wrapper (`lib/analytics/track.ts`). If `NEXT_PUBLIC_POSTHOG_KEY` is unset, `track()` falls back to `console.log('[analytics]', event, props)` so local dev shows instrumentation without a PostHog account.
- **Feature flags**: PostHog for the A/B experiment. Local override via a query param for testing.
- **Tokens**: import `brand-kit/tokens/tokens.css` once in the root layout. Use `var(--token-name)` in Tailwind arbitrary values or CSS.
- **File structure**:
  ```
  app/                    # Next.js routes (page.tsx, signup/page.tsx, welcome/page.tsx, api/users/route.ts)
  components/             # UI components — one per file, colocated tests if any
  lib/
    analytics/            # events.ts (taxonomy), track.ts (wrapper)
    storage/              # notion.ts, memory.ts, index.ts (adapter selector)
  brand-kit/              # copied from challenge-instructions/brand-kit
  docs/                   # architecture, analytics, experiment, performance, ai-workflow, trade-offs
  .claude/                # agents, commands, settings
  ```

## Analytics as part of the product

**Rule: every user-visible action must have its event defined in `lib/analytics/events.ts` and instrumented at the trigger site before merging.**

To add a new event, use the `/add-tracked-event` command — it updates `events.ts`, `docs/analytics.md`, and shows the exact `track()` snippet to paste. Do not add events manually; drift between doc and code is the failure mode this command prevents.

The taxonomy in `docs/analytics.md` is the single source of truth. If a discrepancy is found between doc and code, doc wins — update code to match.

## Agents, commands, and mandatory invocation rules

The AI-native workflow is not decorative. If you build without invoking these agents/commands at the right moments, you're duplicating the work by hand instead of using the system that was designed to prevent typical growth-engineering failure modes. Follow these rules literally.

### Available agents (see `.claude/agents/`)

- **`copy-critic`** — reviews user-visible copy against outcome-oriented, trust-signaling, jargon-free criteria informed by the FX Replay audit.
- **`a11y-reviewer`** — reviews components/pages for WCAG 2.1 AA (contrast, focus, ARIA, semantic HTML, keyboard nav).
- **`analytics-guardian`** — verifies every interaction has a `track()` call matching the typed taxonomy, no drift between events.ts and docs/analytics.md.

### Available commands (see `.claude/commands/`)

- **`/add-tracked-event`** — the ONLY way to add a new analytics event. Updates the type, the doc row, and shows the instrumentation snippet.
- **`/audit-experience surface=<landing|signup|welcome>`** — fans out the 3 agents in parallel over a surface and returns a consolidated report by severity.
- **`/checkpoint`** — quality-gates a commit (typecheck + lint) and creates a conventional-commit message.

### Mandatory invocation rules (non-negotiable)

These are triggered by specific events. Skipping them means the "system around AI" doesn't exist in practice.

1. **Before marking any UI-related task as `completed` via `TaskUpdate`** (tasks that build or modify `app/**`, `components/**`, or CSS): you MUST first invoke `/audit-experience surface=<name>` in the same turn and either apply the findings or explicitly document why you rejected them in `docs/trade-offs.md`. State in your output which findings were applied and which were deferred.

2. **Before adding any new event to `lib/analytics/events.ts`**: you MUST invoke `/add-tracked-event` (do not hand-edit the file). This is the only way to keep the type + `docs/analytics.md` row + instrumentation snippet in lockstep.

3. **Before writing any user-visible copy that will ship** (headlines, subheadlines, CTAs longer than one word, error messages, empty states, form labels, FAQ, welcome content): invoke `copy-critic` on the finished copy and apply the critical + important findings. Minor findings can be deferred; document what and why.

4. **Do NOT invoke agents for trivial work** — typos, one-line style fixes, refactors that don't change user-visible surface, config edits. Reserve them for feature-close moments.

### Self-check before every `TaskUpdate` to `completed` on a UI task

Ask yourself and OUTPUT the answer:
- Did I run `/audit-experience surface=<x>` this turn?
- Are all events I added/modified passing through `/add-tracked-event`?
- Did I run `copy-critic` on any new user-visible copy?

If any answer is "no" and the task involves UI, DO NOT mark it complete. Run the missing step first.

### When you notice you skipped a rule mid-flow

Stop, acknowledge it in your response, run the missed step retroactively, and keep going. Do not silently proceed as if the rule doesn't apply.

## Definition of done per feature

**You must OUTPUT this checklist and its answers before calling `TaskUpdate` to mark any UI task as `completed`.** Not checking it in your head — writing it in the response.

- [ ] `/audit-experience surface=<x>` was invoked this turn — findings applied or documented.
- [ ] Every new event went through `/add-tracked-event` (not hand-edited into events.ts).
- [ ] `copy-critic` was invoked on any new user-visible copy — critical + important findings applied.
- [ ] Responsive at 375px, 768px, 1280px (spot-check, not exhaustive).
- [ ] Uses brand kit tokens exclusively — no raw hex, no non-brand fonts.
- [ ] Any accepted limitation (finding you chose not to fix) documented in `docs/trade-offs.md`.

If any check is unchecked and the task involves UI, the task is NOT done. Do the missing step first.

## Reference documents

Read these when the context asks for depth:

- `docs/architecture.md` — system structure, API design, deployment, infra thinking.
- `docs/analytics.md` — event taxonomy, funnel definition, primary conversion metric, data quality approach.
- `docs/experiment.md` — the A/B experiment: hypothesis, control, variant, success metric, decision criteria.
- `docs/performance.md` — Core Web Vitals, SEO, accessibility, rendering strategy, caching, production risks.
- `docs/ai-workflow.md` — how Claude was used on this project, examples of leverage, examples of AI output that was rejected or corrected.
- `docs/trade-offs.md` — what wasn't built, why, and what would come next with more time.
- `challenge-instructions/` — original challenge PDF and brand kit. Not to be modified.
