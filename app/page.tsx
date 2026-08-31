'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { StickyCTA } from '@/components/landing/StickyCTA'
import { PageviewTracker } from '@/components/landing/PageviewTracker'
import { LandingVerbose } from '@/components/landing/LandingVerbose'
import { LandingMinimal } from '@/components/landing/LandingMinimal'
import { getVariant } from '@/lib/analytics/track'
import type { Variant } from '@/lib/analytics/events'

const KNOWN_VARIANTS: Variant[] = ['control', 'variant_a', 'variant_b']

/**
 * Landing entry point.
 *
 * Resolves the variant in this order:
 *   1. `?v=<variant>` URL param (dev/QA override — lets us preview without
 *      touching the PostHog flag).
 *   2. `getVariant('landing_density', 'control')` — real PostHog flag.
 *   3. Fallback `control`.
 *
 * Client-only (SSR would ship one variant then hydration might swap — small
 * flash accepted here; PostHog `bootstrap` from cookies would eliminate it
 * in prod, documented in trade-offs).
 */
export default function Home() {
  const [variant, setVariant] = useState<Variant>('control')

  useEffect(() => {
    // Query-param override wins over the feature flag — handy for previews.
    const params = new URLSearchParams(window.location.search)
    const override = params.get('v') as Variant | null
    if (override && KNOWN_VARIANTS.includes(override)) {
      setVariant(override)
      return
    }
    const resolved = getVariant('landing_density', 'control') as Variant
    setVariant(resolved)
  }, [])

  return (
    <>
      <PageviewTracker variant={variant} />
      <Header />
      <main id="main" tabIndex={-1}>
        {variant === 'variant_a' ? <LandingMinimal /> : <LandingVerbose />}
      </main>
      <Footer />
      <StickyCTA />
    </>
  )
}
