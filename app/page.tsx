import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Features } from '@/components/landing/Features'
import { FreeTier } from '@/components/landing/FreeTier'
import { SocialProof } from '@/components/landing/SocialProof'
import { FAQ } from '@/components/landing/FAQ'
import { StickyCTA } from '@/components/landing/StickyCTA'
import { Footer } from '@/components/landing/Footer'
import { PageviewTracker } from '@/components/landing/PageviewTracker'

/**
 * Landing page — "Try FX Replay Free".
 *
 * Renders as a server component; only the leaf CTA links, the pageview
 * tracker, and the sticky CTA are client components. Keeps First Load JS
 * minimal.
 *
 * Variant defaults to 'control' until the PostHog feature flag wiring lands
 * (task 8). PageviewTracker fires `landing_viewed` with that value.
 */
export default function LandingPage() {
  const variant = 'control'

  return (
    <>
      <PageviewTracker variant={variant} />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        {/* Sentinel — StickyCTA observes this to know when the hero has scrolled off. */}
        <div id="hero-sentinel" aria-hidden="true" />
        <HowItWorks />
        <Features />
        <FreeTier />
        <SocialProof />
        <section id="faq">
          <FAQ />
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  )
}
