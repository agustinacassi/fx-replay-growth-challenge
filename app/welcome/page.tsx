import type { Metadata } from 'next'
import { Header } from '@/components/landing/Header'
import { WelcomeContent } from '@/components/welcome/WelcomeContent'

export const metadata: Metadata = {
  title: 'Welcome — FX Replay',
  description: 'Your free FX Replay account is ready. Start backtesting.',
  robots: { index: false, follow: false },
}

export default function WelcomePage() {
  return (
    <>
      <Header />
      <WelcomeContent />
    </>
  )
}
