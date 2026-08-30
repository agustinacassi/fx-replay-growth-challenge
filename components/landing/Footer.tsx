import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border-primary/50 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center gap-4 justify-between text-sm text-fg-tertiary">
        <div className="flex items-center gap-3">
          <span className="font-heading font-black tracking-widest text-fg-secondary">
            FX REPLAY
          </span>
          <span className="text-fg-tertiary">
            &middot; Growth challenge marketing experience
          </span>
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
    </footer>
  )
}
