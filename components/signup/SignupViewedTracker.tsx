'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics/track'
import type { CtaLocation, Variant } from '@/lib/analytics/events'

/**
 * Fires `signup_viewed` on mount with the variant and (if available) which
 * CTA on the landing brought the user here. Renders nothing.
 */
export function SignupViewedTracker({
  variant,
  fromLocation,
}: {
  variant: Variant
  fromLocation?: CtaLocation
}) {
  useEffect(() => {
    track('signup_viewed', { variant, from_location: fromLocation })
  }, [variant, fromLocation])
  return null
}
