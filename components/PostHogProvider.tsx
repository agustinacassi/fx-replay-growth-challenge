'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

/**
 * Initializes the PostHog browser client once, with the configuration decided
 * for this project (see JOURNAL for rationale):
 *
 *  - autocapture: OFF — every event is instrumented explicitly.
 *  - session_recording: OFF — no session replay for scope/CWV/privacy.
 *  - capture_pageview: OFF — we fire named `landing_viewed`/`signup_viewed`/etc
 *    events instead, so the funnel uses semantic names.
 *  - persistence: localStorage+cookie — standard.
 *
 * If `NEXT_PUBLIC_POSTHOG_KEY` is not set, this component is a no-op — the
 * `track()` wrapper falls back to `console.log` transparently.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    if (posthog.__loaded) return

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
  }, [])

  return <>{children}</>
}
