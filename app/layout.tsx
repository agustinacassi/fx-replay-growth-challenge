import type { Metadata, Viewport } from 'next'
import { Lato, Nunito_Sans } from 'next/font/google'
import { PostHogProvider } from '@/components/PostHogProvider'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fx-replay-growth-challenge.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FX Replay — Practice trading. Zero risk. No card.',
  description:
    'Backtest strategies on real market data. Free tier — no credit card, no trial that expires. Start in under 2 minutes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    // Images auto-picked from app/opengraph-image.tsx by Next 15.
    title: 'FX Replay — Practice trading. Zero risk. No card.',
    description:
      'Backtest strategies on real market data. Free tier — no credit card required.',
    type: 'website',
    url: '/',
    siteName: 'FX Replay',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FX Replay — Practice trading. Zero risk. No card.',
    description:
      'Backtest strategies on real market data. Free tier — no credit card required.',
    // Twitter reads the OG image by default when card is summary_large_image.
  },
  robots: { index: true, follow: true },
}

/**
 * Structured data — schema.org Organization + WebSite. Rendered as a raw
 * JSON-LD script in <head> so Google can surface knowledge-panel + sitelinks.
 */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FX Replay',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: ['https://fxreplay.com'],
  description:
    'FX Replay is a backtesting and educational platform for retail traders — replay historical markets, test strategies, journal every trade.',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FX Replay',
  url: SITE_URL,
}

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[color:var(--bg-elevated)] focus:text-[color:var(--text-primary)] focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
        >
          Skip to content
        </a>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
