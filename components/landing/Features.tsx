const features = [
  {
    title: 'Replay Mode',
    body: 'Jump to any date. Experience price action as it unfolded — bar by bar.',
  },
  {
    title: 'On-chart trade review',
    body: 'See past trades directly on the chart. Spot inconsistencies you’d miss in a table.',
  },
  {
    title: 'Trade journal',
    body: 'Write down why you entered, what you saw, and what you’d do again. Every trade, searchable.',
  },
  {
    title: 'Time-based analytics',
    body: 'See which hours and days you actually make money — and which ones bleed you.',
  },
  {
    title: 'Montecarlo simulation',
    body: 'See how your edge holds up after 100, 200, or 300 trades — before you risk them live.',
  },
  {
    title: '20+ years of real data',
    body: 'EURUSD from 2005. SPX500 from 2003. Real markets, not synthetic.',
  },
]

export function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">
        Everything below is unlocked the second you sign up.
      </h2>
      <p className="mt-4 text-fg-secondary max-w-2xl">
        No upgrade prompt, no card, no waiting.
      </p>

      <ul
        className="mt-10 md:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        role="list"
      >
        {features.map((f) => (
          <li
            key={f.title}
            className="rounded-xl border border-border-primary/60 bg-bg-secondary p-6"
          >
            <h3 className="font-heading font-bold text-lg text-fg-primary">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-fg-secondary leading-relaxed">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
