import { AssetPills } from './AssetPills'
import { Assets } from './Assets'
import { FAQ } from './FAQ'
import { Features } from './Features'
import { FreeTier } from './FreeTier'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { Indicators } from './Indicators'
import { SocialProof } from './SocialProof'

/**
 * Verbose landing (control arm of the `landing_density` A/B). Text-dense,
 * mirrors fxreplay.com's information architecture: dense assets grid + full
 * indicators grid + 15-feature carousel + social proof mid-page.
 */
export function LandingVerbose() {
  return (
    <>
      <Hero />
      <div id="hero-sentinel" aria-hidden="true" />
      <AssetPills />
      <HowItWorks />
      <Features />
      <Assets />
      <Indicators />
      <FreeTier />
      <SocialProof />
      <section id="faq">
        <FAQ />
      </section>
    </>
  )
}
