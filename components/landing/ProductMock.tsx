/**
 * Illustrated product mock for the hero. Pure SVG + a small annotated overlay,
 * no images, no runtime cost. Communicates "backtest on real chart" without
 * needing a screenshot of the actual app (which would ship the bugs we're
 * trying to route around anyway).
 *
 * A11y: aria-labelled group; text overlays remain HTML so they're readable
 * by screen readers and scale with browser zoom.
 */
export function ProductMock() {
  return (
    <div
      className="relative rounded-2xl border border-border bg-bg-secondary p-4 md:p-6 shadow-2xl overflow-hidden"
      role="img"
      aria-label="Illustration: EUR/USD H1 chart with a simulated backtest trade — entry at 1.0842, exit at 1.0938, +96 pips. Session 1 of 2, backtest run in 4 minutes 32 seconds."
    >
      {/* Top bar — pair + timeframe + faux controls */}
      <div className="flex items-center gap-3 text-xs font-mono text-fg-secondary mb-4">
        <span className="px-2 py-1 rounded bg-bg-tertiary text-fg-primary font-semibold">
          EUR / USD
        </span>
        <span className="px-2 py-1 rounded bg-bg-tertiary">H1</span>
        <span className="px-2 py-1 rounded bg-bg-tertiary">Replay</span>
        <span className="ml-auto text-fg-tertiary">2024-03-18 · 14:00 UTC</span>
      </div>

      {/* Chart SVG */}
      <div className="relative aspect-[16/9]">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* grid */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h-${i}`}
              x1="0"
              x2="800"
              y1={90 * (i + 0.5)}
              y2={90 * (i + 0.5)}
              stroke="var(--border-primary)"
              strokeWidth="1"
              strokeDasharray="2,4"
            />
          ))}
          {/* price line — hand-crafted upward-then-down candles */}
          <path
            d="M 20,320 L 60,300 L 100,310 L 140,270 L 180,260 L 220,240 L 260,255 L 300,210 L 340,180 L 380,195 L 420,150 L 460,140 L 500,165 L 540,120 L 580,110 L 620,135 L 660,90 L 700,105 L 740,130 L 780,115"
            fill="none"
            stroke="var(--blue-500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* entry marker */}
          <g>
            <circle cx="220" cy="240" r="6" fill="var(--green-500)" />
            <circle cx="220" cy="240" r="12" fill="var(--green-500)" fillOpacity="0.2" />
          </g>
          {/* exit marker */}
          <g>
            <circle cx="660" cy="90" r="6" fill="var(--blue-500)" />
            <circle cx="660" cy="90" r="12" fill="var(--blue-500)" fillOpacity="0.2" />
          </g>
          {/* entry → exit dotted line */}
          <line
            x1="220"
            y1="240"
            x2="660"
            y2="90"
            stroke="var(--fg-tertiary)"
            strokeWidth="1"
            strokeDasharray="3,4"
            opacity="0.5"
          />
        </svg>

        {/* Entry label */}
        <div className="absolute left-[25%] top-[52%] -translate-y-full pb-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-fg-tertiary">
            Entry
          </div>
          <div className="text-xs font-mono font-semibold text-fg-primary">1.0842</div>
        </div>

        {/* Exit + P&L badge */}
        <div className="absolute right-[15%] top-[18%] -translate-y-full pb-2 text-right">
          <div className="text-[10px] font-mono uppercase tracking-wider text-fg-tertiary">
            Exit
          </div>
          <div className="text-xs font-mono font-semibold text-fg-primary">1.0938</div>
          <div className="mt-1 inline-block px-2 py-0.5 rounded bg-[color:var(--green-500)]/15 text-[color:var(--green-500)] text-xs font-mono font-semibold">
            +96 pips
          </div>
        </div>
      </div>

      {/* Bottom action bar — journal shortcut illustrations */}
      <div className="mt-4 flex items-center gap-2 text-xs text-fg-tertiary">
        <span className="px-2 py-1 rounded bg-bg-tertiary font-mono">journaled</span>
        <span>&middot;</span>
        <span>Session 1 of 2</span>
        <span className="ml-auto font-mono">Backtest run in 4m 32s</span>
      </div>
    </div>
  )
}
