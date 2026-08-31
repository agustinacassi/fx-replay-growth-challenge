'use client'

import { useState } from 'react'

/**
 * Assets section — mirrors fxreplay.com's dense assets grid (tabs by market,
 * cards with brokers + plan access + timeframes + initial date). This is
 * intentionally text-dense: it's the "verbose" hypothesis under test. The
 * minimal variant replaces this whole thing with a single inline sentence.
 *
 * Data is a curated slice of fxreplay.com's real assets — enough to look
 * realistic and information-heavy without pretending we ship all 120+.
 */

type PlanAccess = 'Beginner+' | 'Pro only'

type Asset = {
  symbol: string
  category: MarketKey
  brokers: string[]
  plan: PlanAccess
  timeframes: string[]
  initialDate: string
}

type MarketKey = 'forex' | 'metals' | 'indexes' | 'futures' | 'crypto' | 'stocks'

const markets: { key: MarketKey; label: string }[] = [
  { key: 'forex', label: 'Forex' },
  { key: 'metals', label: 'Metals' },
  { key: 'indexes', label: 'Indexes' },
  { key: 'futures', label: 'Futures' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'stocks', label: 'Stocks' },
]

const assets: Asset[] = [
  // Forex
  { symbol: 'EURUSD', category: 'forex', brokers: ['OANDA', 'Dukascopy', 'Pepperstone'], plan: 'Beginner+', timeframes: ['5s', '1m', '5m', '15m', '1h', '1D', '1W', '1M'], initialDate: 'Jan 2, 2005' },
  { symbol: 'GBPUSD', category: 'forex', brokers: ['OANDA', 'Dukascopy'], plan: 'Beginner+', timeframes: ['5s', '1m', '5m', '1h', '1D'], initialDate: 'May 7, 2002' },
  { symbol: 'USDCHF', category: 'forex', brokers: ['OANDA', 'Dukascopy'], plan: 'Beginner+', timeframes: ['5s', '1m', '1h', '1D'], initialDate: 'May 7, 2002' },
  { symbol: 'EURJPY', category: 'forex', brokers: ['OANDA', 'Dukascopy'], plan: 'Beginner+', timeframes: ['5s', '1m', '1h', '1D'], initialDate: 'May 7, 2002' },
  { symbol: 'DXY', category: 'forex', brokers: ['Dukascopy'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Aug 4, 2003' },
  { symbol: 'NZDCHF', category: 'forex', brokers: ['Dukascopy', 'OANDA'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Apr 1, 2007' },
  // Metals
  { symbol: 'XAUUSD', category: 'metals', brokers: ['OANDA', 'Pepperstone'], plan: 'Beginner+', timeframes: ['5s', '1m', '5m', '1h', '1D'], initialDate: 'May 7, 2004' },
  { symbol: 'XAGUSD', category: 'metals', brokers: ['OANDA'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jun 3, 2005' },
  // Indexes
  { symbol: 'SPX500USD', category: 'indexes', brokers: ['OANDA'], plan: 'Beginner+', timeframes: ['5s', '1m', '5m', '1h', '1D'], initialDate: 'Mar 21, 2003' },
  { symbol: 'NAS100USD', category: 'indexes', brokers: ['OANDA'], plan: 'Beginner+', timeframes: ['5s', '1m', '5m', '1h', '1D'], initialDate: 'Mar 21, 2003' },
  { symbol: 'US30USD', category: 'indexes', brokers: ['OANDA'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Mar 21, 2003' },
  // Futures (Pro only)
  { symbol: '6E (Euro FX)', category: 'futures', brokers: ['CME'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jan 3, 2012' },
  { symbol: 'RTY (Russell 2000)', category: 'futures', brokers: ['CME'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jan 3, 2012' },
  { symbol: 'NG (Natural Gas)', category: 'futures', brokers: ['CME'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jan 3, 2012' },
  // Crypto (Pro only)
  { symbol: 'BTCUSDT', category: 'crypto', brokers: ['Binance'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Aug 17, 2017' },
  { symbol: 'ETHUSDT', category: 'crypto', brokers: ['Binance'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Aug 17, 2017' },
  { symbol: 'SOLUSDT', category: 'crypto', brokers: ['Binance'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Aug 11, 2020' },
  // Stocks
  { symbol: 'AAPL', category: 'stocks', brokers: ['NASDAQ'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jan 3, 2007' },
  { symbol: 'TSLA', category: 'stocks', brokers: ['NASDAQ'], plan: 'Beginner+', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'Jun 29, 2010' },
  { symbol: 'META', category: 'stocks', brokers: ['NASDAQ'], plan: 'Pro only', timeframes: ['1m', '5m', '1h', '1D'], initialDate: 'May 18, 2012' },
]

export function Assets() {
  const [tab, setTab] = useState<MarketKey>('forex')
  const filtered = assets.filter((a) => a.category === tab)

  return (
    <section
      id="assets"
      className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black leading-tight">
          Backtest 120+ assets across 6 markets.
        </h2>
        <p className="mt-4 text-fg-secondary">
          Real historical data from OANDA, Dukascopy, CME, NASDAQ, and Binance.
          Some assets go back 20+ years.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Assets by market"
        className="mt-10 flex flex-wrap justify-center gap-2"
      >
        {markets.map((m) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={tab === m.key}
            aria-controls={`assets-panel-${m.key}`}
            id={`assets-tab-${m.key}`}
            onClick={() => setTab(m.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
              tab === m.key
                ? 'bg-bg-tertiary text-fg-primary'
                : 'text-fg-tertiary hover:text-fg-secondary'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`assets-panel-${tab}`}
        aria-labelledby={`assets-tab-${tab}`}
        className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((a) => (
          <article
            key={a.symbol}
            className="rounded-xl border border-border-primary/60 bg-bg-secondary p-5 flex flex-col gap-4"
          >
            <header className="flex items-start justify-between gap-3">
              <h3 className="font-heading font-bold text-lg text-fg-primary">
                {a.symbol}
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-fg-secondary bg-bg-tertiary">
                {markets.find((m) => m.key === a.category)?.label}
              </span>
            </header>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-fg-tertiary text-xs mb-1">Available brokers</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {a.brokers.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-full text-xs bg-bg-tertiary text-fg-secondary"
                    >
                      {b}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-fg-tertiary text-xs">Plan access</dt>
                <dd>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      a.plan === 'Beginner+'
                        ? 'bg-[color:var(--text-success)]/15 text-[color:var(--text-success)]'
                        : 'bg-[color:var(--text-warning)]/15 text-[color:var(--text-warning)]'
                    }`}
                  >
                    {a.plan}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-fg-tertiary text-xs mb-1">Available timeframes</dt>
                <dd className="flex flex-wrap gap-1">
                  {a.timeframes.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-bg-tertiary text-fg-secondary"
                    >
                      {t}
                    </span>
                  ))}
                  {a.timeframes.length > 5 && (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-fg-tertiary">
                      +{a.timeframes.length - 5}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-1 border-t border-border-primary/40">
                <dt className="text-fg-tertiary text-xs">Initial date</dt>
                <dd className="font-mono text-xs text-fg-secondary">
                  {a.initialDate}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-fg-tertiary">
        Showing {filtered.length} of 120+ assets. Full catalog is browsable
        inside the app after signup.
      </p>
    </section>
  )
}
