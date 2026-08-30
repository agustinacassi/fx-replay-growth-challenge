'use client'

import { useEffect, useState } from 'react'
import { CtaLink } from '@/components/CtaLink'

/**
 * Floating CTA that appears once the user has scrolled past the hero.
 * Uses an IntersectionObserver on a sentinel element rendered by the hero
 * region rather than scroll listeners — cheaper, and Safari-friendly.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <CtaLink
        href="/signup"
        location="sticky_nav"
        label="Start free — no card"
        className="inline-flex items-center gap-2 bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] font-semibold px-6 py-3 rounded-full shadow-2xl border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
      >
        Start free — no card
      </CtaLink>
    </div>
  )
}
