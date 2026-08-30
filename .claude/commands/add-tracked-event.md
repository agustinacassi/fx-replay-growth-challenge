---
description: Add a new analytics event across the type, the doc, and (optionally) the trigger site. Prevents drift between taxonomy and code.
---

You are adding a new analytics event to the project. Parse the user's request for:

- **`name`** (required): event name in `snake_case` (e.g., `signup_started`).
- **`trigger`** (required): plain-English description of when the event fires (e.g., "user clicks 'Try Free' CTA in the hero").
- **`props`** (required): list of prop names and their TypeScript types (e.g., `location: 'hero' | 'sticky_nav' | 'features', variant: string`).
- **`fire_at`** (optional): file:line hint if the user already knows where the `track()` call goes.

If any required piece is missing, ask for it before proceeding.

## Steps

Perform these in order. Do not skip.

### 1. Read the current state
- Read `lib/analytics/events.ts` to see the existing `Events` type shape and conventions.
- Read `docs/analytics.md` to see the taxonomy table format.

### 2. Update the type
Add the new event to `lib/analytics/events.ts` inside the `Events` type. Match the existing formatting. Use literal union types for enum-like props (`'hero' | 'sticky_nav'`), not `string`, when the set is known.

### 3. Update the doc
Add a row to the events table in `docs/analytics.md` with columns: `Event name | Trigger | Props | Notes`. Match the exact event name and prop names used in the type. Keep the trigger description short but unambiguous.

### 4. Show the instrumentation snippet
Return to the user:

```
Added `<event_name>` to types and docs.

Snippet to paste at the trigger site:

    import { track } from '@/lib/analytics/track'

    track('<event_name>', {
      <prop1>: <example_value>,
      <prop2>: <example_value>,
    })
```

If `fire_at` was provided, also read that file and suggest the exact line to insert the call. Do NOT edit the trigger site automatically — leave that to the human so they can place the call in the right handler.

### 5. Verify the type compiles
Run `npx tsc --noEmit` and report the result. If there are errors related to your changes, fix them before returning control.

## Rules

- Never invent an event or prop the user didn't ask for.
- Never edit the trigger site file — only the types and the doc. The user pastes the snippet themselves.
- If the event already exists, do not duplicate. Ask whether to update the existing shape or pick a new name.
- Prop names must be `camelCase` in TypeScript but the corresponding doc row uses the same casing (consistency > aesthetics).
- Keep the doc row concise — no filler.
