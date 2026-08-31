'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CtaLink } from '@/components/CtaLink'

/**
 * Landing header with a demo-only navigation menu.
 *
 * - Features / Resources / Pricing: NON-INTERACTIVE placeholders that mirror
 *   the real fxreplay.com nav for visual/brand parity. They do not navigate
 *   anywhere and are not tracked — clicking a dropdown item is a no-op.
 * - Sign in: real link to /signup, tracked as `header_secondary`.
 * - Get Started: real primary CTA to /signup, tracked as `header_cta`.
 *
 * Rationale: a landing that looks like it belongs to fxreplay.com's product
 * ecosystem converts better than a bare micro-site, but we don't have the
 * scope to build the full IA. Documented in trade-offs.
 */

const featuresItems = [
  { label: 'Backtest', body: 'Train and trade with confidence.' },
  { label: 'Indicators', body: 'Real metrics. Real growth.' },
  { label: 'Mentor AI', body: 'Refine decisions, sharpen execution.' },
  { label: 'Journal', body: 'Journal like a pro. Trade like one too.' },
  { label: 'Prop Firm Simulator', body: 'Simulated challenges that feel real.' },
  { label: 'FXR Script', body: 'Custom indicators, built FX Replay.' },
]

const resourcesItems = [
  { label: 'Education', body: 'Educational content for better trading.' },
  { label: 'Trading Strategies', body: 'Free strategies built by traders.' },
  { label: 'Podcast', body: 'Expert insights from pro traders.' },
  { label: 'Events', body: 'Demos, contests, and live backtesting.' },
  { label: 'Support', body: 'Get help and access FAQs.' },
]

export function Header() {
  const [openMenu, setOpenMenu] = useState<'features' | 'resources' | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  // On the post-signup surface the user is already IN — showing "Sign in" /
  // "Get Started" would be a broken loop that dark-patterns them back to signup.
  const showAuthCtas = pathname !== '/welcome'

  useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    const onClick = (e: MouseEvent) => {
      if (!navRef.current) return
      if (!navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [openMenu])

  return (
    <header className="border-b border-border-primary/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="FX Replay — home"
          className="inline-flex items-center flex-none"
        >
          <Image
            src="/brand/logo.svg"
            alt="FX Replay"
            width={120}
            height={16}
            priority
            className="h-auto w-[120px]"
          />
        </Link>

        <nav
          aria-label="Primary"
          ref={navRef}
          className="hidden lg:flex items-center gap-2"
        >
          <DemoDropdown
            label="Features"
            items={featuresItems}
            isOpen={openMenu === 'features'}
            onToggle={() =>
              setOpenMenu(openMenu === 'features' ? null : 'features')
            }
          />
          <DemoDropdown
            label="Resources"
            items={resourcesItems}
            isOpen={openMenu === 'resources'}
            onToggle={() =>
              setOpenMenu(openMenu === 'resources' ? null : 'resources')
            }
          />
          <DemoLink label="FXR Battles" />
          <DemoLink label="Pricing" />
        </nav>

        {showAuthCtas && (
          <div className="flex items-center gap-3 flex-none">
            <CtaLink
              href="/signup"
              location="header_secondary"
              label="Sign in"
              className="hidden sm:inline-flex text-sm font-semibold text-fg-secondary hover:text-fg-primary transition-colors px-2 py-2"
            >
              Sign in
            </CtaLink>
            <CtaLink
              href="/signup"
              location="header_cta"
              label="Get Started"
              className="inline-flex items-center justify-center bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)]"
            >
              Get Started
            </CtaLink>
          </div>
        )}
      </div>
    </header>
  )
}

/** Non-interactive nav item that mirrors the real site's flat links. */
function DemoLink({ label }: { label: string }) {
  return (
    <span
      className="text-sm font-semibold text-fg-secondary px-3 py-2 cursor-default select-none"
      aria-disabled="true"
    >
      {label}
    </span>
  )
}

/** Demo dropdown — opens a panel with items that don't navigate anywhere. */
function DemoDropdown({
  label,
  items,
  isOpen,
  onToggle,
}: {
  label: string
  items: { label: string; body: string }[]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center gap-1 text-sm font-semibold text-fg-secondary hover:text-fg-primary transition-colors px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 3.5 L5 6.5 L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        // No role="menu" — that would imply full arrow-key navigation per WAI-ARIA APG.
        // Since these items are demo-only no-ops, we render a plain disclosure panel.
        <div className="absolute left-0 top-full mt-2 w-[420px] rounded-xl border border-border-primary bg-bg-secondary shadow-2xl p-3 grid grid-cols-1 gap-1 z-30">
          {items.map((it) => (
            <div
              key={it.label}
              className="text-left px-3 py-2.5 rounded-lg cursor-default"
            >
              <div className="text-sm font-semibold text-fg-primary">
                {it.label}
              </div>
              <div className="text-xs text-fg-tertiary mt-0.5">{it.body}</div>
            </div>
          ))}
          <p className="mt-1 px-3 pt-3 border-t border-border-primary/50 text-[10px] font-mono uppercase tracking-widest text-fg-tertiary">
            Demo navigation — not wired in this scope
          </p>
        </div>
      )}
    </div>
  )
}
