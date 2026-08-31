'use client'

import posthog from 'posthog-js'
import type { EventName, EventProps } from './events'

/**
 * Thin analytics wrapper. Behavior:
 *
 *  - If `NEXT_PUBLIC_POSTHOG_KEY` is configured AND we're in the browser,
 *    forwards to PostHog.
 *  - Otherwise (missing key, SSR, dev without env), logs to console with a
 *    `[analytics]` prefix. This lets reviewers clone the repo, `npm run dev`,
 *    and observe the instrumentation without needing a PostHog account.
 *
 * The wrapper is intentionally typed against `Events` — invalid event names
 * or malformed props fail at compile time via the `/add-tracked-event`
 * discipline, not at runtime.
 */
export function track<E extends EventName>(event: E, props: EventProps<E>): void {
  if (typeof window === 'undefined') {
    // SSR: no analytics.
    return
  }

  if (isPostHogEnabled()) {
    posthog.capture(event, props as Record<string, unknown>)
    return
  }

  // Dev/reviewer fallback — visible in the browser console.
  // eslint-disable-next-line no-console
  console.info(`[analytics] ${event}`, props)
}

/**
 * Associate the current session with an authenticated user id and
 * (optionally) a set of person properties. Call this once after signup
 * succeeds — subsequent events will be attributed to the same person.
 */
export function identify(userId: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  if (isPostHogEnabled()) {
    posthog.identify(userId, properties)
    return
  }
  // eslint-disable-next-line no-console
  console.info(`[analytics] identify`, { userId, properties })
}

/**
 * Read the variant a user is assigned to for a given feature flag.
 * Returns `fallback` if PostHog is not initialized, the flag is unknown,
 * or the flag is a boolean flag (variants use multivariate flags).
 *
 * Also fires `experiment_variant_assigned` the first time a variant is
 * resolved for a given flag in this session — makes the assignment
 * observable in the funnel data.
 */
const _seen = new Set<string>()
export function getVariant(flagKey: string, fallback: string = 'control'): string {
  if (typeof window === 'undefined') return fallback
  if (!isPostHogEnabled()) return fallback

  const value = posthog.getFeatureFlag(flagKey)
  const variant = typeof value === 'string' ? value : fallback

  if (!_seen.has(flagKey)) {
    _seen.add(flagKey)
    track('experiment_variant_assigned', { flag_key: flagKey, variant })
  }
  return variant
}

/**
 * Clear identity — call on logout or when the user destroys their session.
 * Not used in this scope but exposed for symmetry.
 */
export function resetIdentity(): void {
  if (typeof window === 'undefined') return
  if (isPostHogEnabled()) posthog.reset()
}

/**
 * True when PostHog should be used as the analytics sink. Intentionally does
 * NOT check `posthog.__loaded` — PostHog's SDK internally queues events fired
 * before init completes and flushes them once loaded. Gating on __loaded here
 * caused the first pageview event to fall to the console fallback because the
 * child (PageviewTracker) mounts and fires before the parent Provider's init
 * useEffect runs.
 */
function isPostHogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
}
