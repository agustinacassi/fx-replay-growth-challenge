import type { Metadata, Viewport } from 'next'
import { Lato, Nunito_Sans } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'FX Replay — Practice trading. Zero risk. No card.',
  description:
    'Backtest strategies on real market data. Free tier — no credit card, no trial that expires. Start in under 2 minutes.',
  openGraph: {
    title: 'FX Replay — Practice trading. Zero risk. No card.',
    description:
      'Backtest strategies on real market data. Free tier — no credit card required.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  )
}
