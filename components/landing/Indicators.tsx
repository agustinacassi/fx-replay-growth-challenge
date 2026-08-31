'use client'

import { useState } from 'react'

/**
 * Indicators section — mirrors fxreplay.com's paragraph-heavy indicators grid
 * (Standard / Custom tabs, each card a 4-line description).
 * Intentionally verbose — this is the density we test against in the minimal
 * variant, which replaces the whole section with a one-line inline mention.
 */

type IndicatorTab = 'standard' | 'custom'

type Indicator = { name: string; description: string; badge: 'Standard' | 'Custom' }

const standard: Indicator[] = [
  {
    name: 'Volatility Zero Trend Close-to-Close',
    badge: 'Standard',
    description:
      'Tracks raw price movement between closing candles, giving a fast snapshot of market volatility. Ideal for spotting momentum shifts, entry timing after consolidation, or filtering trades during quiet price action.',
  },
  {
    name: 'Majority Rule (Aroon)',
    badge: 'Standard',
    description:
      'Tracks how recently a high or low has occurred within a user-defined period. Ideal for identifying trend strength, reversal shifts, and consolidation zones — perfect for strategy filtering and backtesting.',
  },
  {
    name: 'Zig Zag',
    badge: 'Standard',
    description:
      'Visually connects key swing highs and lows to help traders filter noise, spot trend reversals, and backtest market structure logic with clean, simplified price movement lines.',
  },
  {
    name: 'Williams Fractal',
    badge: 'Standard',
    description:
      'Identifies swing highs and lows that signal potential trend reversals, breakouts, or trade entries. Especially effective paired with Alligator, VWAP, or liquidity zones during session-based backtesting.',
  },
  {
    name: 'Williams Alligator',
    badge: 'Standard',
    description:
      'Uses three smoothed moving averages to visually define whether the market is asleep, awakening, trending, or exhausted. Ideal for directional bias, breakout timing, and filtering trades in choppy conditions.',
  },
  {
    name: 'Williams %R',
    badge: 'Standard',
    description:
      'Spots overbought/oversold conditions, divergences, and momentum shifts during replay sessions. Ideal for scalping pullbacks, confirming trend exhaustion, and refining trade entries/exits with price structure.',
  },
]

const custom: Indicator[] = [
  {
    name: 'Build your own with FXR Script',
    badge: 'Custom',
    description:
      'FXR Script lets you write your own indicators using FX Replay’s scripting language. Define signals from your rules, automate strategy filters, and layer them across the same charts you use for backtesting.',
  },
]

export function Indicators() {
  const [tab, setTab] = useState<IndicatorTab>('standard')
  const list = tab === 'standard' ? standard : custom

  return (
    <section
      id="indicators"
      className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black leading-tight">
          Standard indicators, plus your own.
        </h2>
        <p className="mt-4 text-fg-secondary">
          Every free account includes access to standard technical indicators.
          Pro users can build custom ones with FXR Script.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Indicators category"
        className="mt-10 flex justify-center gap-1 p-1 rounded-full bg-bg-secondary border border-border-primary/60 max-w-fit mx-auto"
      >
        {(['standard', 'custom'] as IndicatorTab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            aria-controls={`indicators-panel-${t}`}
            id={`indicators-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
              tab === t
                ? 'bg-bg-tertiary text-fg-primary'
                : 'text-fg-tertiary hover:text-fg-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`indicators-panel-${tab}`}
        aria-labelledby={`indicators-tab-${tab}`}
        className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {list.map((ind) => (
          <article
            key={ind.name}
            className="rounded-xl border border-border-primary/60 bg-bg-secondary p-6 flex flex-col gap-3"
          >
            <span className="inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-fg-secondary bg-bg-tertiary">
              {ind.badge}
            </span>
            <h3 className="font-heading font-bold text-lg text-fg-primary">
              {ind.name}
            </h3>
            <p className="text-sm text-fg-secondary leading-relaxed">
              {ind.description}
            </p>
          </article>
        ))}
      </div>

      {tab === 'standard' && (
        <p className="mt-6 text-center text-sm text-fg-tertiary">
          Showing 6 of the standard set. See the full list inside the app.
        </p>
      )}
    </section>
  )
}
