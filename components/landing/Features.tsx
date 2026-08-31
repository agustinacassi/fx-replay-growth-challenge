'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 15-feature horizontal carousel — mirrors fxreplay.com's "Explore our key
 * features" pattern. Content taken verbatim (or lightly tightened) from their
 * live site. Each card now includes a real product screenshot (SVG, pulled
 * from fxreplay.com's CDN and self-hosted under /public/product-features/).
 *
 * Snap-scroll for touch, prev/next arrows for desktop, pagination indicator
 * matching the source. Scrollbar hidden — navigation lives in arrows only.
 */

type Feature = { title: string; body: string; image: string }

const features: Feature[] = [
  {
    title: 'Trading Journal',
    body: 'Track trades in real time, review smarter, repeat what works.',
    image: '/product-features/trading-journal.svg',
  },
  {
    title: 'Mentor AI',
    body: 'AI-powered feedback on your trading behavior — identify patterns, improve execution.',
    image: '/product-features/mentor-ai.svg',
  },
  {
    title: 'FXR Script',
    body: 'Build custom indicators and signals based on your trading rules.',
    image: '/product-features/fxr-script.svg',
  },
  {
    title: 'Prop Firm Simulator',
    body: 'Train under authentic prop firm requirements to build discipline before real challenges.',
    image: '/product-features/prop-firm.svg',
  },
  {
    title: 'Replay Mode',
    body: 'Jump to any date. Experience price action as it unfolded — bar by bar.',
    image: '/product-features/replay-mode.svg',
  },
  {
    title: 'Multipair & Multichart',
    body: 'Run simultaneous views at different timeframes on the same asset. Charts by TradingView.',
    image: '/product-features/multipair.svg',
  },
  {
    title: 'Go-to Feature',
    body: 'Navigate instantly to favorite sessions, price levels, news events, or trade closes.',
    image: '/product-features/go-to.svg',
  },
  {
    title: 'Economic Calendar',
    body: 'Display historical news events during replay sessions. Test your reaction, not your memory.',
    image: '/product-features/economic-calendar.svg',
  },
  {
    title: 'Performance Analytics',
    body: 'A clear snapshot of your key metrics and overall performance in one view.',
    image: '/product-features/performance-analytics.svg',
  },
  {
    title: 'P&L Tracker',
    body: 'Visualize profit and loss trends in real time during sessions.',
    image: '/product-features/pnl-tracker.svg',
  },
  {
    title: 'Time-based Analytics',
    body: 'Break down results by hour, session, or day — trade more when you win, less when you lose.',
    image: '/product-features/time-based-analytics.svg',
  },
  {
    title: 'Performance Calendar',
    body: 'See profitable days in green, losses in red. Spot streaks and consistency shifts.',
    image: '/product-features/performance-calendar.svg',
  },
  {
    title: 'On-chart Trade Review',
    body: 'Replay past trades directly on the chart. See entries, exits, and management context.',
    image: '/product-features/on-chart-review.svg',
  },
  {
    title: 'Montecarlo Simulation',
    body: 'Project your strategy over 100, 200, or 300 trades. Understand variance before it costs you.',
    image: '/product-features/montecarlo.svg',
  },
  {
    title: 'Seconds Timeframe',
    body: 'Study micro-moves with seconds-based charts. Improve timing on fast markets.',
    image: '/product-features/seconds-timeframe.svg',
  },
]

const CARD_WIDTH = 340

export function Features() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
    const gap = 16
    const stride = CARD_WIDTH + gap
    setActiveIndex(Math.min(features.length - 1, Math.round(el.scrollLeft / stride)))
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByStep = (direction: 'prev' | 'next') => {
    const el = scrollerRef.current
    if (!el) return
    const stride = CARD_WIDTH + 16
    el.scrollBy({ left: direction === 'next' ? stride : -stride, behavior: 'smooth' })
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">
            Explore what you&rsquo;ll practice with.
          </h2>
          <p className="mt-4 text-fg-secondary max-w-2xl">
            Everything below is unlocked the second you sign up. No card. No
            upgrade prompt.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-none">
          <p className="text-xs font-mono uppercase tracking-widest text-fg-tertiary tabular-nums mr-2">
            {String(activeIndex + 1).padStart(2, '0')} / {features.length}
          </p>
          <button
            type="button"
            onClick={() => scrollByStep('prev')}
            disabled={!canScrollLeft}
            aria-label="Previous features"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border-primary bg-bg-secondary text-fg-primary transition-opacity hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          >
            <ArrowGlyph direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep('next')}
            disabled={!canScrollRight}
            aria-label="Next features"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border-primary bg-bg-secondary text-fg-primary transition-opacity hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
          >
            <ArrowGlyph direction="right" />
          </button>
        </div>
      </div>

      <div className="relative -mx-6">
        <div
          ref={scrollerRef}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-2 no-scrollbar"
          role="region"
          aria-label="Product features"
          tabIndex={0}
        >
          <ul className="flex gap-4" role="list">
            {features.map((f, i) => (
              <li
                key={f.title}
                className="snap-start flex-none w-[300px] md:w-[340px]"
                aria-setsize={features.length}
                aria-posinset={i + 1}
              >
                <article className="h-full rounded-xl border border-border-primary/60 bg-bg-secondary overflow-hidden flex flex-col transition duration-200 hover:-translate-y-1 hover:border-border-primary hover:shadow-2xl">
                  <div className="relative aspect-video bg-bg-tertiary overflow-hidden">
                    <Image
                      src={f.image}
                      alt={`${f.title} — product interface screenshot`}
                      fill
                      sizes="(min-width: 768px) 340px, 300px"
                      className="object-cover object-top"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span
                      aria-hidden="true"
                      className="text-[10px] font-mono uppercase tracking-widest text-fg-tertiary tabular-nums"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-heading font-bold text-lg text-fg-primary">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary leading-relaxed flex-1">
                      {f.body}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[color:var(--bg-primary)] to-transparent"
        />
      </div>

      <p className="mt-6 md:hidden text-xs font-mono uppercase tracking-widest text-fg-tertiary text-center">
        Swipe to see more &middot; {String(activeIndex + 1).padStart(2, '0')} / {features.length}
      </p>
    </section>
  )
}

function ArrowGlyph({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M8.5 3.5 L4 7 L8.5 10.5' : 'M5.5 3.5 L10 7 L5.5 10.5'}
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
