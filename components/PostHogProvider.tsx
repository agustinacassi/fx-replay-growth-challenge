'use client'

import posthog from 'posthog-js'

// Initialize at module import (client-only) so the SDK is ready before ANY
// child component's useEffect runs. Previously init lived inside a useEffect,
// which meant PageviewTracker's effect (children-first order) called
// posthog.capture() before init and the events were silently dropped in prod.
// Fast Refresh masked this in dev by keeping the module warm across renders.
if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (key && !posthog.__loaded) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: true,
      persistence: 'localStorage+cookie',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.debug()
        }
      },
    })
  }
}

/**
 * Passthrough — init is done at module scope above. Kept as a component so
 * the layout tree structure stays explicit and future providers (feature-flag
 * context, identity bootstrap) have a home.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
