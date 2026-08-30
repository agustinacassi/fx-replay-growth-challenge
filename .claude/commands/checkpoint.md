---
description: Commit the current progress. Runs typecheck + lint first; if they fail, aborts and reports what to fix. Then generates a conventional-commit message from the diff and commits after user confirmation.
---

You are creating a checkpoint commit for the current state of the repo. Follow these steps in order — do not skip any.

## 1. Preflight: verify checks pass

Run these in parallel:

```bash
npm run typecheck
npm run lint
```

If either fails:
- STOP. Do not proceed to commit.
- Report the errors clearly.
- Say: "Checkpoint aborted — fix the errors above first, then invoke `/checkpoint` again."

If both pass, proceed.

## 2. Show what's about to be committed

Run in parallel:

```bash
git status --short
git diff --stat
```

Present a concise summary to the user:
- How many files changed (added/modified/deleted counts).
- Group by area if useful (e.g., "app/: 3 files, lib/: 2 files, docs/: 1 file").
- Flag anything unusual (e.g., a change in `.env` — that should never be committed).

## 3. Propose a conventional commit message

Based on the diff, generate a commit message following Conventional Commits:

- **Type**: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `style`.
- **Scope** (optional): the area touched (e.g., `feat(storage): ...`).
- **Subject**: imperative, ≤72 chars, no trailing period.
- **Body** (optional, blank line before): 1-3 bullets explaining the *why* if non-obvious.

Message-picking heuristics:
- New API endpoint or route → `feat(api):`.
- New component or page → `feat(ui):`.
- Storage/persistence changes → `feat(storage):` or `refactor(storage):`.
- Docs, journal, agents, commands → `docs:` or `chore(ai):`.
- Config, scaffolding → `chore:`.
- Multi-scope change → drop the scope, describe both in the body.

Present the proposed message to the user like:

```
Proposed commit:

    feat(api): add Users API with Notion + in-memory storage adapter

    - POST/GET /api/users, PATCH /api/users/[id]
    - Zod validation, consistent error envelope
    - Adapter selects Notion when NOTION_TOKEN is set, else in-memory

OK to commit? (or send an edited message)
```

## 4. Wait for user confirmation

- If user says "ok", "sí", "dale", or similar → proceed with the exact proposed message.
- If user provides an edited or replacement message → use theirs verbatim.
- If user says "no" or wants to abort → stop cleanly, no commit.

## 5. Commit

Stage all changes and commit with the approved message:

```bash
git add -A
git commit -m "<approved message>"
```

Do NOT push automatically. Pushing is a separate action the user requests explicitly.

## 6. Report

Show the resulting commit:

```bash
git log -1 --oneline
```

Confirm: "Checkpoint saved. Next: <suggest what to do next based on the task list>."

## Rules

- Never commit `.env`, `.env.local`, or files with secrets. If you spot one in the diff, refuse and ask the user to fix `.gitignore`.
- Never `git add` individual files unless the user asks — always `git add -A` after preflight passes.
- Never use `--no-verify`.
- Never amend a previous commit unless the user explicitly asks.
- Never force-push.
- If `git status` shows nothing to commit, say so and stop — no empty commit.
