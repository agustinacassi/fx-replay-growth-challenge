import { CtaLink } from '@/components/CtaLink'
import { ProductMock } from './ProductMock'

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            Practice trading strategies before you risk a dollar.
          </h1>
          <p className="mt-6 text-lg text-fg-secondary max-w-xl">
            Replay historical forex markets, backtest your setups, and journal
            every trade — in your first 10 minutes.{' '}
            <span className="text-fg-primary font-semibold">Free forever. No card.</span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CtaLink
              href="/signup"
              location="hero"
              label="Start free — no card"
              className="inline-flex items-center justify-center bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] font-semibold px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)]"
            >
              Start free — no card
            </CtaLink>
            <p className="text-sm text-fg-tertiary">
              Sign up in 30 seconds. Backtest immediately.
            </p>
          </div>
        </div>

        <div className="md:pl-4">
          <ProductMock />
        </div>
      </div>
    </section>
  )
}
