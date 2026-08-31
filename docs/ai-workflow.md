# AI-Native Workflow

The premise of the AI-native section of this challenge — as stated in the brief — is not "used AI for autocomplete." It is "built a system around AI." What follows is that system.

## Philosophy

- **Delegation is deliberate.** Implementation is delegated to Claude; decisions on product, copy, architecture, and trade-offs are the human's. The pattern held throughout — the human never had to review every line, only the decisions that inform the lines.
- **Every AI call has a defined responsibility.** No open-ended "review the code, tell me what's wrong." Each agent has a criteria list, an output format, and a specific invocation moment.
- **The type system is the contract.** Analytics events, API schemas, and storage interfaces are all typed — so AI-generated code that violates them fails at compile time, before the human ever reviews it.
- **Trade-offs are the deliverable.** Every non-obvious decision has a rationale documented in `JOURNAL.md`. The AI helped surface the trade-offs; the human made the calls.

## Project-level instructions

**`CLAUDE.md`** (repository root) is the single-page brief loaded into every Claude session on this project. It defines:

- Project purpose and narrative bet ("free that feels free").
- Target user (retail traders, price-sensitive, skeptical of "free trials").
- Scope IN / OUT with the explicit rule "if a feature appears that is not in scope, ask before building."
- Working philosophy — no over-engineering, explain before deciding architecture, delegate implementation.
- Stack, conventions (Next.js 15, brand-kit tokens only, PostHog wrapper).
- **Mandatory invocation rules for agents and commands** (see below).
- Definition of done per feature (a checklist Claude must output before marking a UI task complete).

The mandatory rules were added midway through the project after the human noticed the AI was skipping the review agents. Reinforcement was structural, not disciplinary — the rules cite specific verifiable triggers ("before `TaskUpdate` to completed on a UI task, MUST invoke `/audit-experience`").

## Agents

Four specialized reviewers, one file each in `.claude/agents/`. Each has a criteria list, an output format, and a specific invocation moment. Together they cover the four dimensions of a growth landing: persuasion, inclusion, measurement, and reach.

| Agent | Domain | When invoked | What it produces |
|---|---|---|---|
| `copy-critic` | Persuasion | After writing any user-visible copy (headlines, CTAs, error messages) | Findings grouped by severity — critical (rewrites required), important (rewrites recommended), minor (voice / tone). Cites file:line, quotes the offending text, proposes exact paste-ready rewrites. |
| `a11y-reviewer` | Inclusion | After completing a component or page | WCAG 2.1 AA findings — contrast, focus, ARIA, semantic HTML, keyboard nav, forms, motion. Cites WCAG success criterion + concrete code fix. |
| `analytics-guardian` | Measurement | After adding or modifying interactions | Missing events, drift between types and code, weak coverage (events fired without slicing dimensions). Points at exact call sites; suggests the `/add-tracked-event` invocation to add anything missing. |
| `perf-seo-reviewer` | Reach | Before writing `docs/performance.md` (and any time a big structural change lands) | Perf + SEO patterns Lighthouse cannot see at runtime: unnecessary client components, missing image / font optimization, blocking scripts, metadata completeness per route, structured data, sitemap / robots. |

**Trade-off encountered:** custom agents in `.claude/agents/*.md` did not auto-register as `subagent_type` values during the sessions on this project. Workaround: invoked via `general-purpose` with the agent's system prompt inlined verbatim in the message. The value is preserved; the DX is worse. See [trade-offs.md](./trade-offs.md).

## Commands and reusable workflows

Three commands in `.claude/commands/`, invoked via `/<command-name>`.

### `/add-tracked-event`

Prevents the failure mode where the analytics doc says "we track X" but the code fires it with different props (or not at all). Given a name, trigger, and props, the command:

1. Reads `lib/analytics/events.ts` (source of truth).
2. Adds the new event to the `Events` type with the right shape.
3. Adds a row to `docs/analytics.md` (the taxonomy table).
4. Runs `tsc --noEmit` to verify.
5. Returns the exact `track()` snippet to paste at the trigger site.

**Effect on the project:** every event fires with props that match the doc, because both live in the same command's output. Zero drift.

### `/audit-experience`

Fans out the four review agents in parallel over a surface (landing / signup / welcome), then consolidates the findings into a single report ordered by severity across all four dimensions. Used at feature-close moments — after the landing was built, after signup was built, after the enrichment pass.

**Effect on the project:** the review-before-commit gate is a single command instead of four sequential prompts, so it actually gets used.

### `/checkpoint`

Runs typecheck and lint as a preflight, generates a conventional-commit message from the diff, commits after confirmation. **Never pushes automatically** — push is a separate deliberate action.

**Effect on the project:** every commit has been preflight-verified. The git log reads as a coherent narrative because the messages follow a consistent structure.

## MCP integrations

Three MCPs were used with real value on this project.

### Figma MCP (write access + read)

- **Read** — pulled brand-kit tokens, feature screenshots, product context.
- **Write** — annotated the original fxreplay.com screenshots in the user's Figma with post-it findings (10 friction points identified during audit). Those annotations became the narrative bet.

### Notion MCP (write + query)

- **Write** — created the `FX Replay Challenge` page and the `Signups` database with the correct schema (columns, select options, auto-increment). Zero manual clicking in the Notion UI.
- **Query** — verified every signup during development. When the Users API was wired, a `curl POST /api/users` followed by a Notion MCP query showed the row appearing in real time — end-to-end evidence without a browser.
- **In production** — the Next.js runtime uses the SDK (`@notionhq/client`), not the MCP. MCP is for AI-ops (setup, inspection, debugging); SDK is for app-ops (runtime writes). The division is explicit.

### Chrome MCP

- Intended for browser automation (interactive testing, screenshot capture). The extension was not connected during this project's runtime, so the fallback was a WebFetch-based approach for content extraction and CLI-driven end-to-end tests. Documented in [trade-offs.md](./trade-offs.md).

### MCPs that would connect in production

- **Sentry MCP** — pull runtime errors during development; agents propose fixes based on live stack traces.
- **Vercel MCP** — trigger deploys, inspect logs from Claude directly.
- **PostHog MCP** — query event volumes, create insights and dashboards from Claude without hand-clicking in the PostHog UI. Not connected on this project (the setup cost was higher than the manual Insights creation for a single dashboard); would pay off with active experimentation.

## How the pieces work together

A typical feature-close cycle on this project:

1. **Human** — describes the feature intent.
2. **Claude** — proposes structure and trade-offs; human approves.
3. **Claude** — writes the component. The PostToolUse hook (`.claude/settings.json`) runs `tsc --noEmit --incremental` after every `.ts/.tsx` edit; type errors surface immediately.
4. **Human** — reviews the visual output.
5. **Claude** — invokes `/audit-experience surface=<name>`, which fans out all four review agents in parallel.
6. **Claude** — applies critical + high-impact important findings, defers the rest to `docs/trade-offs.md` with rationale.
7. **Human** — approves.
8. **Claude** — invokes `/checkpoint`, generates the commit message, pushes after confirmation.
9. **Human** — verifies against production behavior when relevant (signup end-to-end, PostHog Activity feed).

The AI never marks its own work complete without the human's approval loop.

## Examples of AI improving execution

Concrete moments during this project:

- **Audit-informed product bet.** The Figma post-it annotations (created via Figma MCP) turned diffuse "the current landing has issues" into ten specific findings, which turned into a testable A/B hypothesis. Without the AI-native annotation loop, the hypothesis would have been "landing feels bad" — untestable.
- **Storage adapter pattern.** Claude proposed the adapter pattern up-front when the human asked "how do we handle persistence." The alternative (hardcoded Notion) would have required the reviewer to set up Notion credentials just to run `npm run dev`. The adapter is one of the strongest reviewer-experience decisions in the project.
- **Live end-to-end verification via CLI.** Instead of asking the human to sign up in a browser, Claude issued 9 sequential `curl POST` calls that walked the entire funnel (landing_viewed → signup_succeeded → welcome_viewed → identify), then queried Notion via MCP to confirm the row landed. The pipeline verification was fully automated.
- **The `perf-seo-reviewer` agent.** Suggested midway through the project when the human asked "does it make sense to have an agent for this or is it covered by a11y?" — Claude clarified the overlap (~30%) vs. unique value (~70%), the human approved, the agent was written and run, and its findings became `docs/performance.md`.

## Examples of AI outputs that were rejected or corrected

Recorded in `JOURNAL.md` alongside their fixes. A representative sample:

- **PostHog race condition** — the initial `track.ts` wrapper checked `posthog.__loaded` before capturing, which caused the first pageview event (`landing_viewed`) to fall to the console fallback because `PageviewTracker` mounts and fires before `PostHogProvider.init()` completes. Fix: removed the check — PostHog SDK's internal queue handles this natively. Documented as a lesson.
- **Notion DB ID confusion** — Claude used the data-source ID (returned by the Notion MCP as `collection://...`) in `.env.local`. The `@notionhq/client` SDK expects the block ID (from the URL). Signups returned "Cannot find database" for a full session before the bug was traced. Documented — the error message was misleading ("check permissions") for what was actually an ID mismatch.
- **Custom agents not registering** — Claude assumed `subagent_type: 'copy-critic'` would resolve to the file in `.claude/agents/copy-critic.md`. It did not. Workaround: inline the agent's system prompt in a `general-purpose` invocation. Value preserved, ergonomics worse.
- **Content overloading in Landing A enrichment** — the first draft of `Features.tsx` had 15 cards with paragraph descriptions per card. Human pushback: "esto se está pareciendo a lo que estamos criticando de fxreplay.com." Claude scoped down to short taglines + real product screenshots. The feature carousel now uses the same content depth as fxreplay.com but reads leaner.
- **Landing forced client-side** — the perf-seo-reviewer flagged that `app/page.tsx` being `'use client'` (to read the PostHog flag) forces hydration on the entire subtree. Human decided to accept for scope; documented as trade-off with fix path (server-side flag resolution via cookie bootstrap).

## Committed configuration for review

Everything the AI-native workflow depends on is committed to the repository:

- `CLAUDE.md` — project-level instructions.
- `.claude/agents/*.md` — four agent definitions.
- `.claude/commands/*.md` — three command definitions.
- `.claude/settings.json` — team-wide hooks (PostToolUse typecheck on `.ts/.tsx` edits).
- `.claude/settings.local.json` — gitignored per-user overrides.

The reviewer can inspect the system itself, not only the description of it.
