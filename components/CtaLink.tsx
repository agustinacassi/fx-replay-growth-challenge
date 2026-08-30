'use client'

import Link from 'next/link'
import { track } from '@/lib/analytics/track'
import type { CtaLocation, Variant } from '@/lib/analytics/events'

type Props = {
  href: string
  location: CtaLocation
  label: string
  variant?: Variant
  className?: string
  children: React.ReactNode
}

/**
 * Semantic CTA link that fires `cta_clicked` before navigation.
 * Use everywhere a "conversion-adjacent" click happens — hero, sticky nav,
 * inline calls, footer. Wraps next/link so prefetching and app-routing keep
 * working.
 */
export function CtaLink({
  href,
  location,
  label,
  variant = 'control',
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        track('cta_clicked', {
          location,
          label,
          variant,
          destination: href,
        })
      }
    >
      {children}
    </Link>
  )
}
