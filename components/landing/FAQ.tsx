'use client'

import { track } from '@/lib/analytics/track'
import type { Variant } from '@/lib/analytics/events'

const faqs = [
  {
    q: 'Is FX Replay really free, or is it a trial?',
    a: 'Genuinely free — no credit card required, no trial period, and no automatic conversion to a paid plan. You keep access to core backtesting features indefinitely.',
  },
  {
    q: 'What are the free-tier limits?',
    a: '2 backtesting sessions with 1 indicator each, 1 week of historical data per session, up to 50 trades per session, and 1 journal checklist template. Enough to run real backtests and prove the tool to yourself. No card, ever, to find out.',
  },
  {
    q: 'Will I be charged if I don’t cancel?',
    a: 'There’s nothing to cancel on the free tier. Upgrades are opt-in and you’re never enrolled by default.',
  },
  {
    q: 'What data does FX Replay use?',
    a: 'Real historical data from OANDA, Dukascopy, CME, NASDAQ, and Binance. EURUSD goes back to 2005; SPX500 to 2003. Charts powered by TradingView.',
  },
  {
    q: 'Does FX Replay execute real trades?',
    a: 'No. FX Replay is a backtesting and educational platform — it doesn’t connect to your broker or execute real trades. Practice here, then take what you’ve learned wherever you trade for real.',
  },
]

export function FAQ({ variant = 'control' as Variant }: { variant?: Variant }) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight">
        Straight answers.
      </h2>
      <div className="mt-10 divide-y divide-[color:var(--border-primary)]/50">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group py-5"
            onToggle={(e) =>
              track('faq_toggled', {
                question: f.q,
                opened: (e.currentTarget as HTMLDetailsElement).open,
                variant,
              })
            }
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-lg text-fg-primary marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)] rounded">
              <span>{f.q}</span>
              <span
                aria-hidden="true"
                className="text-fg-tertiary text-xl transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-fg-secondary leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
