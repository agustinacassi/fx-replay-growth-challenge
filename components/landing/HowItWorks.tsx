const steps = [
  {
    n: '1',
    title: 'Sign up.',
    body: 'Email or Google. 30 seconds. No card.',
  },
  {
    n: '2',
    title: 'Pick a session.',
    body: 'Choose from forex, metals, indexes, and more — real historical data going back to 2003, any timeframe from 1-minute to monthly.',
  },
  {
    n: '3',
    title: 'Trade the replay.',
    body: 'Enter, exit, journal. FX Replay tracks what worked and what didn’t.',
  },
]

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">
        From signup to your first backtest — 3 steps.
      </h2>
      <ol className="mt-10 md:mt-14 grid md:grid-cols-3 gap-8" role="list">
        {steps.map((s) => (
          <li key={s.n} className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg-tertiary text-fg-primary font-heading font-black"
            >
              {s.n}
            </span>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="text-fg-secondary">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
