import Image from 'next/image'
import Link from 'next/link'
import { CtaLink } from '@/components/CtaLink'

/**
 * Landing footer — mirrors fxreplay.com's information architecture:
 * a brand + 5-column link grid, utility nav, and a CFTC-style disclaimer.
 *
 * Real / trackable links: Sign up, FAQ, Repo, fxreplay.com.
 * Demo placeholders (rendered as <span aria-disabled>): everything else.
 * A footnote at the bottom makes the demo status explicit to the reviewer.
 */

const navColumns: Array<{
  title: string
  items: Array<
    | string
    | { label: string; href: string; internal?: boolean; external?: boolean }
  >
}> = [
  {
    title: 'FX Replay',
    items: ['Backtest', 'Mentor AI', 'Journal', 'Prop Firm Simulator', 'FXR Script'],
  },
  {
    title: 'Account',
    items: [
      { label: 'Sign up', href: '/signup', internal: true },
      'Log in',
    ],
  },
  {
    title: 'Company',
    items: ['About', 'Blog', 'FXR Battles'],
  },
  {
    title: 'Help Center',
    items: [
      { label: 'FAQs', href: '/#faq', internal: true },
      'Support',
      'Contact',
    ],
  },
  {
    title: 'Legal',
    items: ['Privacy Policy', 'Terms & Conditions'],
  },
]

export function Footer() {
  return (
    <footer className="mt-16">
      {/* Brand + 5 nav columns */}
      <section aria-label="Site navigation">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid gap-10 md:gap-8 md:grid-cols-[180px_repeat(5,1fr)]">
            <div>
              <Link
                href="/"
                aria-label="FX Replay — home"
                className="inline-block"
              >
                <Image
                  src="/brand/logo.svg"
                  alt="FX Replay"
                  width={140}
                  height={18}
                  className="h-auto w-[140px]"
                  priority={false}
                />
              </Link>
              {process.env.NEXT_PUBLIC_SHOW_META === 'true' && (
                <p className="mt-3 text-xs text-fg-tertiary">
                  Growth challenge marketing experience
                </p>
              )}
            </div>

            {navColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-heading font-bold text-fg-primary">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5" role="list">
                  {col.items.map((item, i) => {
                    if (typeof item === 'string') {
                      // Demo placeholder — no navigation, styled like a link but non-interactive
                      return (
                        <li key={i}>
                          <span
                            aria-disabled="true"
                            className="text-sm text-fg-tertiary cursor-default select-none"
                          >
                            {item}
                          </span>
                        </li>
                      )
                    }
                    return (
                      <li key={i}>
                        <FooterNavLink {...item} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom row — utility nav + demo note + disclaimer */}
      <section className="border-t border-border-primary/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center gap-4 justify-between text-sm text-fg-tertiary">
          <nav aria-label="Footer utility" className="flex flex-wrap gap-5">
            <a
              href="https://github.com/agustinacassi/fx-replay-growth-challenge"
              className="hover:text-fg-primary transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              Repo
            </a>
            <a
              href="https://fxreplay.com"
              className="hover:text-fg-primary transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              fxreplay.com
            </a>
          </nav>
          <p className="text-[11px] font-mono uppercase tracking-widest text-fg-tertiary/80">
            Demo navigation — most footer links are placeholders in this scope
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-10">
          <p className="text-xs text-fg-tertiary max-w-3xl">
            Hypothetical performance results have limitations. Simulated results
            do not represent actual trading. FX Replay is an educational
            backtesting platform — it doesn&rsquo;t connect to your broker or
            execute real trades.
          </p>
        </div>
      </section>
    </footer>
  )
}

function FooterNavLink({
  label,
  href,
  internal,
}: {
  label: string
  href: string
  internal?: boolean
  external?: boolean
}) {
  if (internal) {
    // Route-owned link (e.g. /signup, /#faq) — use next/link + tracked CtaLink
    // when it's a conversion-adjacent action, plain Link otherwise.
    if (href === '/signup') {
      return (
        <CtaLink
          href={href}
          location="footer"
          label={label}
          className="text-sm text-fg-secondary hover:text-fg-primary transition-colors"
        >
          {label}
        </CtaLink>
      )
    }
    return (
      <Link
        href={href}
        className="text-sm text-fg-secondary hover:text-fg-primary transition-colors"
      >
        {label}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-fg-secondary hover:text-fg-primary transition-colors"
    >
      {label}
    </a>
  )
}
