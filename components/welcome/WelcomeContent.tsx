'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { identify, track } from '@/lib/analytics/track'
import type { Provider, Variant } from '@/lib/analytics/events'

const nextSteps = [
  {
    key: 'run_backtest',
    title: 'Run your first backtest',
    body: 'Pick a pair and a period. Enter, exit, journal — see if your edge holds.',
    primary: true,
  },
  {
    key: 'explore_indicators',
    title: 'Set up your first indicator',
    body: 'SMA, EMA, RSI. Layer it on your chart in one click.',
    primary: false,
  },
  {
    key: 'getting_started_guide',
    title: 'Read the 3-minute quickstart',
    body: 'See your first setup work (or not) in three minutes.',
    primary: false,
  },
]

const unlocked = [
  'Trade forex, metals, and major indexes',
  'Run 2 full backtest sessions',
  'Layer an indicator (SMA / EMA / RSI)',
  'Replay a week of market history',
  'Log up to 50 trades per session',
  'Journal every trade on TradingView charts',
]

/**
 * Only the param-dependent tail (identify + analytics + provider line + click
 * handlers) is Suspense-wrapped. The static shell (chip + h1 + subhead + unlocked
 * list) renders immediately and does NOT fall to the skeleton — improves LCP on
 * static builds and reduces layout shift on the confirmation moment.
 */

function ParamAwareTail({
  onFocusMain,
}: {
  onFocusMain: () => void
}) {
  const params = useSearchParams()
  const userId = params.get('u') ?? 'anonymous'
  const provider = (params.get('p') ?? 'email') as Provider
  const variant = (params.get('v') ?? 'control') as Variant
  const isDirectHit = userId === 'anonymous'

  useEffect(() => {
    onFocusMain()
    if (!isDirectHit) {
      identify(userId, { provider, variant })
    }
    track('welcome_viewed', { user_id: userId, provider, variant })
    // Direct hits fabricate defaults — analytics-quality gap tracked in
    // docs/trade-offs.md; funnel is best analyzed excluding user_id === 'anonymous'.
  }, [userId, provider, variant, isDirectHit, onFocusMain])

  const clickStep = (step: string) => {
    track('welcome_next_step_clicked', { step, user_id: userId })
  }

  return (
    <>
      <section className="mt-14">
        <h2 className="text-sm font-mono uppercase tracking-widest text-fg-tertiary">
          Next
        </h2>
        <ul className="mt-4 space-y-3" role="list">
          {nextSteps.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => clickStep(s.key)}
                aria-describedby={`${s.key}-note`}
                className={`w-full text-left rounded-xl border p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                  s.primary
                    ? 'border-[color:var(--color-brand)] bg-brand/10 hover:bg-brand/15'
                    : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-fg-primary">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-fg-secondary">{s.body}</p>
                    <p
                      id={`${s.key}-note`}
                      className="mt-2 text-[10px] font-mono uppercase tracking-widest text-fg-tertiary"
                    >
                      Demo — click tracked, real navigation stubbed in this scope
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`flex-none text-2xl leading-none ${
                      s.primary ? 'text-brand' : 'text-fg-tertiary'
                    }`}
                  >
                    →
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-fg-tertiary">
        {provider === 'google'
          ? 'Signed up with your Google account.'
          : 'Signed up with email.'}
      </p>
    </>
  )
}

/** Skinny placeholder for the tail while Suspense resolves — a couple of muted
 * bars sized to the buttons that will replace them. Zero layout shift. */
function TailSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="mt-14">
      <span className="sr-only">Loading your next steps…</span>
      <div className="h-4 w-16 bg-bg-secondary rounded animate-pulse" />
      <div className="mt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-bg-secondary animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function WelcomeContent() {
  const mainRef = useRef<HTMLElement | null>(null)

  // Focus main only if we came from /signup — avoids stealing focus on direct
  // hits (bookmarks, refresh) and skips the iOS Safari scroll jump.
  // `preventScroll` keeps the viewport at the top regardless.
  const focusMain = () => {
    if (typeof document === 'undefined') return
    if (!document.referrer.includes('/signup')) return
    mainRef.current?.focus({ preventScroll: true })
  }

  return (
    <main
      ref={mainRef}
      id="main"
      tabIndex={-1}
      className="max-w-4xl mx-auto px-6 py-16 md:py-24"
    >
      <div className="max-w-2xl">
        <p
          role="status"
          aria-live="polite"
          className="inline-block px-3 py-1 rounded-full bg-[color:var(--text-success)]/15 text-[color:var(--text-success)] text-xs font-mono uppercase tracking-widest"
        >
          Account created
        </p>
        <h1 className="mt-6 text-4xl md:text-5xl font-black leading-tight">
          You&rsquo;re in. Your practice account is live.
        </h1>
        <p className="mt-5 text-lg text-fg-secondary">
          Your first backtest is one click away. Pick a pair and press play.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-sm font-mono uppercase tracking-widest text-fg-tertiary">
          What you can do now
        </h2>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3" role="list">
          {unlocked.map((u) => (
            <li
              key={u}
              className="rounded-lg border border-border-primary/60 bg-bg-secondary px-4 py-3 text-sm text-fg-primary flex items-center gap-3"
            >
              <span aria-hidden="true" className="text-[color:var(--text-success)]">
                ✓
              </span>
              {u}
            </li>
          ))}
        </ul>
      </section>

      <Suspense fallback={<TailSkeleton />}>
        <ParamAwareTail onFocusMain={focusMain} />
      </Suspense>
    </main>
  )
}
