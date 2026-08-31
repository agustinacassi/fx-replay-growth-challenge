import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border-primary/50 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between text-sm text-fg-tertiary">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black tracking-widest text-fg-secondary">
              FX REPLAY
            </span>
            {process.env.NEXT_PUBLIC_SHOW_META === 'true' && (
              <span className="text-fg-tertiary">
                &middot; Growth challenge marketing experience
              </span>
            )}
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            <a
              href="https://github.com/agustinacassi/fx-replay-growth-challenge"
              className="hover:text-fg-primary transition-colors"
              rel="noopener"
            >
              Repo
            </a>
            <Link href="/#faq" className="hover:text-fg-primary transition-colors">
              FAQ
            </Link>
            <a
              href="https://fxreplay.com"
              className="hover:text-fg-primary transition-colors"
              rel="noopener"
            >
              fxreplay.com
            </a>
          </nav>
        </div>
        <p className="text-xs text-fg-tertiary border-t border-border-primary/40 pt-6 max-w-3xl">
          Hypothetical performance results have limitations. Simulated results do
          not represent actual trading. FX Replay is an educational backtesting
          platform — it doesn’t connect to your broker or execute real trades.
        </p>
      </div>
    </footer>
  )
}
