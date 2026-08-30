---
description: Run copy-critic, a11y-reviewer, and analytics-guardian in parallel over a surface (landing | signup | welcome) and return a consolidated report ordered by severity.
---

You are running a quality gate over a completed surface of the "Try FX Replay Free" experience. The user will pass `surface=<landing|signup|welcome>` (or a similar hint). Identify which files belong to that surface, then fan out the three review agents in parallel and consolidate their findings.

## Steps

### 1. Resolve the surface
Map the surface name to the relevant files:

- **landing** → `app/page.tsx`, `components/landing/**`, related.
- **signup** → `app/signup/**`, `components/signup/**`, related.
- **welcome** → `app/welcome/**`, `components/welcome/**`, related.

If the user provided a more specific hint (a file path, a component name), use that instead.

If nothing matches, ask the user to clarify before running the agents.

### 2. Fan out the three agents in parallel

Invoke, in a single message, three subagents using the Agent tool:

1. **`copy-critic`** — pass the list of files in scope. Prompt: "Review all user-visible copy in these files against the growth criteria. Return findings ordered by severity."
2. **`a11y-reviewer`** — pass the same list. Prompt: "Review these files for WCAG 2.1 AA accessibility. Return findings ordered by severity."
3. **`analytics-guardian`** — pass the same list. Prompt: "Verify every interaction in these files has instrumentation matching the typed taxonomy. Return missing or drifted events."

Wait for all three to complete.

### 3. Consolidate the report

Format the response as follows:

```
## /audit-experience — surface: <name>

Files reviewed: <list>

### Critical (must fix)
- [copy] <finding + location + rewrite>
- [a11y] <finding + location + fix>
- [analytics] <finding + location + fix>

### Important (should fix)
- ...

### Minor (nice to have)
- ...

### Summary
- Copy: <clean | N findings>
- A11y: <clean | N findings>
- Analytics: <clean | N findings>

### Suggested next actions
1. <top priority action>
2. <second>
3. <third>
```

Order every finding by severity across all three agents, not by agent. A "critical" a11y finding sits above an "important" copy finding.

### 4. Do not modify files
This command is a quality gate. It reports, it does not fix. The user reads the report and decides what to apply, what to defer, and what to document in `docs/trade-offs.md`.

## Rules

- Always fan out the three agents in parallel (single message, three tool calls). Never sequentially.
- If a surface has zero interactions, analytics-guardian may report "nothing to check" — that's fine, include it in the summary.
- If all three agents come back clean, say so plainly and stop — do not pad the report.
- Keep the consolidated report under ~1000 words. If findings exceed that, cut minor items first, then note "N additional minor findings omitted for brevity — invoke agents individually to see the full list".
