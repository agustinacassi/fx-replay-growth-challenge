const faqs = [
  {
    q: 'Is a credit card required?',
    a: 'No. Ever. Not for signup, not for the free tier, not for future usage of the free features.',
  },
  {
    q: 'Does the free tier expire?',
    a: 'No. It’s free forever. If you want more sessions or indicators, you can upgrade — but you don’t have to.',
  },
  {
    q: 'Will I be charged if I don’t cancel?',
    a: 'There’s nothing to cancel on the free tier. Upgrades are opt-in and you’re never enrolled by default.',
  },
  {
    q: 'Can I use FX Replay with any broker?',
    a: 'FX Replay is a backtesting and replay tool — it doesn’t connect to your broker or execute real trades. Practice here, then take what you’ve learned wherever you trade for real.',
  },
]

export function FAQ() {
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
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-lg text-fg-primary marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] rounded">
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
