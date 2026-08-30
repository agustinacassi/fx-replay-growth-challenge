'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { track, identify } from '@/lib/analytics/track'
import type { Provider, Variant } from '@/lib/analytics/events'

const nextSteps = [
  {
    key: 'run_backtest',
    title: 'Run your first backtest',
    body: 'Pick a pair and a period. Enter, exit, journal — see what worked.',
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
    body: 'Fastest way to go from account to insight.',
    primary: false,
  },
]

const unlocked = [
  '2 backtesting sessions',
  '1 technical indicator',
  '1 week of historical data',
  'Trade journal',
]

function InnerContent() {
  const params = useSearchParams()
  const userId = params.get('u') ?? 'anonymous'
  const provider = (params.get('p') ?? 'email') as Provider
  const variant = (params.get('v') ?? 'control') as Variant

  useEffect(() => {
    if (userId !== 'anonymous') {
      identify(userId, { provider, variant })
    }
    track('welcome_viewed', { user_id: userId, provider, variant })
  }, [userId, provider, variant])

  const clickStep = (step: string) => {
    track('welcome_next_step_clicked', { step, user_id: userId })
  }

  return (
    <main id="main" className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="inline-block px-3 py-1 rounded-full bg-[color:var(--text-success)]/15 text-[color:var(--text-success)] text-xs font-mono uppercase tracking-widest">
          Account created
        </p>
        <h1 className="mt-6 text-4xl md:text-5xl font-black leading-tight">
          You’re in. No card was asked. None ever will be.
        </h1>
        <p className="mt-5 text-lg text-fg-secondary">
          Your free tier is ready — start practicing whenever you want.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-sm font-mono uppercase tracking-widest text-fg-tertiary">
          What you just unlocked
        </h2>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3" role="list">
          {unlocked.map((u) => (
            <li
              key={u}
              className="rounded-lg border border-border-primary/60 bg-bg-secondary px-4 py-3 text-sm text-fg-primary flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="text-[color:var(--text-success)]"
              >
                ✓
              </span>
              {u}
            </li>
          ))}
        </ul>
      </section>

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
        Signed up as{' '}
        <span className="font-mono text-fg-secondary">
          {provider === 'google' ? 'Google account' : 'email account'}
        </span>
        {userId !== 'anonymous' && (
          <>
            {' '}
            &middot; user id{' '}
            <span className="font-mono text-fg-secondary">{userId}</span>
          </>
        )}
      </p>
    </main>
  )
}

/**
 * useSearchParams needs a Suspense boundary during static export. Wrapping it
 * here keeps the app/welcome/page.tsx clean.
 */
export function WelcomeContent() {
  return (
    <Suspense fallback={<WelcomeSkeleton />}>
      <InnerContent />
    </Suspense>
  )
}

function WelcomeSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="h-6 w-32 bg-bg-secondary rounded animate-pulse" />
      <div className="mt-6 h-12 w-3/4 bg-bg-secondary rounded animate-pulse" />
      <div className="mt-4 h-6 w-1/2 bg-bg-secondary rounded animate-pulse" />
    </main>
  )
}
