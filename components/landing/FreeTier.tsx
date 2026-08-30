import { CtaLink } from '@/components/CtaLink'

const bullets = [
  {
    title: '2 backtesting sessions',
    body: 'Test any strategy on real market data.',
  },
  {
    title: '1 technical indicator',
    body: 'SMA, EMA, RSI — your pick.',
  },
  {
    title: '1 week of historical data',
    body: 'Per session, at any timeframe.',
  },
  {
    title: 'Trade journal',
    body: 'Review your decisions and outcomes.',
  },
]

export function FreeTier() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            What you get, free.
          </h2>
          <p className="mt-6 text-fg-secondary">
            No credit card. Never expires. No auto-billing. Upgrade whenever —
            never on signup.
          </p>
          <CtaLink
            href="/signup"
            location="features"
            label="Start free — no card"
            className="mt-8 inline-flex items-center justify-center bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)]"
          >
            Start free — no card
          </CtaLink>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4" role="list">
          {bullets.map((b) => (
            <li
              key={b.title}
              className="rounded-xl border border-border-primary/60 bg-bg-secondary p-5"
            >
              <h3 className="font-heading font-bold text-lg">{b.title}</h3>
              <p className="mt-1 text-sm text-fg-secondary">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
