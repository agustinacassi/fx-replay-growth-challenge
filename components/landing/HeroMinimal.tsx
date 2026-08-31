import { CtaLink } from '@/components/CtaLink'

/**
 * Minimal hero — no product image, single centered column, one CTA, thin trust
 * bar. This is the "less text" side of the A/B test on landing density.
 * Deliberately strips the product illustration to lean on typography +
 * whitespace as the only visual load-bearing elements above the fold.
 */
export function HeroMinimal() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
        Never lose money on a bad idea again.
      </h1>
      <p className="mt-8 text-lg md:text-xl text-fg-secondary max-w-2xl mx-auto">
        Replay real markets, backtest your setups, and journal every trade —
        in your first 10 minutes.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <CtaLink
          href="/signup"
          location="hero"
          label="Start free — no card required"
          className="inline-flex items-center justify-center bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] font-semibold px-7 py-3.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)]"
        >
          Start free — no card required
        </CtaLink>
        <p className="text-sm text-fg-tertiary">
          Sign up in 30 seconds. Backtest immediately.
        </p>
      </div>

      <ul
        className="mt-12 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-fg-tertiary font-mono uppercase tracking-wider"
        role="list"
        aria-label="Platform highlights"
      >
        <li>120+ assets</li>
        <li aria-hidden="true">·</li>
        <li>20+ years of data</li>
        <li aria-hidden="true">·</li>
        <li>Trained by 1M+ traders</li>
      </ul>
    </section>
  )
}
