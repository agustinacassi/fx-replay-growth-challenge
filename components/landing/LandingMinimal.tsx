import { ChartShowcase } from './ChartShowcase'
import { FAQ } from './FAQ'
import { FeaturesMinimal } from './FeaturesMinimal'
import { FreeTier } from './FreeTier'
import { HeroMinimal } from './HeroMinimal'
import { HowItWorks } from './HowItWorks'
import { SocialProof } from './SocialProof'

/**
 * Minimal landing (variant_a of the `landing_density` A/B). Strips the dense
 * assets + indicators sections and the 15-feature carousel. Section order
 * front-loads credibility (SocialProof right below the hero) BEFORE the
 * process demystification (HowItWorks) — hypothesis: trust closes the click,
 * process reassurance sustains the scroll.
 */
export function LandingMinimal() {
  return (
    <>
      <HeroMinimal />
      <div id="hero-sentinel" aria-hidden="true" />
      <SocialProof emphasis="featured" />
      <HowItWorks />
      <FeaturesMinimal />
      <ChartShowcase />
      <FreeTier />
      <section id="faq">
        <FAQ />
      </section>
    </>
  )
}
