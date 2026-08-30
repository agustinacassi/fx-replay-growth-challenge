import Link from 'next/link'
import { CtaLink } from '@/components/CtaLink'

/**
 * Minimal top header — wordmark on the left, secondary "Sign in" CTA on the
 * right. Kept as a server component; only the CTA link is client (for the
 * analytics beacon).
 */
export function Header() {
  return (
    <header className="border-b border-border-primary/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" aria-label="FX Replay — home" className="flex items-center gap-2">
          <span className="font-heading font-black tracking-widest text-sm">
            FX REPLAY
          </span>
        </Link>
        <CtaLink
          href="/signup"
          location="inline"
          label="Sign in"
          className="text-sm font-semibold text-fg-secondary hover:text-fg-primary transition-colors"
        >
          Sign in
        </CtaLink>
      </div>
    </header>
  )
}
