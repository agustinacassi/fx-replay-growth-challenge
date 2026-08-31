/**
 * Thin strip of asset pills below the hero — signals breadth of markets at a
 * glance. Verbose-landing only; the minimal variant skips this entirely and
 * relies on a single inline sentence instead.
 */
const pills = ['EURUSD', 'XAUUSD', 'SPX500', 'BTCUSDT', 'NAS100', 'AAPL', '+115 more']

export function AssetPills() {
  return (
    <section
      aria-label="Assets available at a glance"
      className="max-w-6xl mx-auto px-6 pb-10"
    >
      <p className="text-xs font-mono uppercase tracking-widest text-fg-tertiary mb-3">
        Tradeable now
      </p>
      <ul className="flex flex-wrap gap-2" role="list">
        {pills.map((p) => (
          <li
            key={p}
            className="px-3 py-1.5 rounded-full border border-border-primary/60 bg-bg-secondary text-xs font-mono text-fg-secondary"
          >
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}
