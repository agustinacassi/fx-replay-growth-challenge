'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics/track'
import type { Variant } from '@/lib/analytics/events'

/**
 * Fires `landing_viewed` once on mount with UTM + referrer context. Renders
 * nothing. Kept as a leaf client component so the parent can stay a server
 * component and keep its First Load JS small.
 */
export function PageviewTracker({ variant }: { variant: Variant }) {
  useEffect(() => {
    const url = new URL(window.location.href)
    track('landing_viewed', {
      variant,
      utm_source: url.searchParams.get('utm_source') || undefined,
      referrer: document.referrer || undefined,
    })
  }, [variant])
  return null
}
