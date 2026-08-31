import Image from 'next/image'

/**
 * Minimal features grid — 6 features, static 3-column layout with product
 * screenshots (real fxreplay.com interface). Same visual pattern as the
 * verbose Features carousel but reduced from 15 → 6 to test whether reduced
 * density converts better.
 */
const features = [
  {
    title: 'Replay Mode',
    body: 'Jump to any date and experience price action bar by bar. Test how you would have reacted — without the pressure of live money.',
    image: '/product-features/replay-mode.svg',
  },
  {
    title: 'Trade Journal',
    body: 'Log every entry, exit, and the reason behind the trade. Searchable and reviewable so patterns you would otherwise miss surface on their own.',
    image: '/product-features/trading-journal.svg',
  },
  {
    title: 'On-chart trade review',
    body: 'See past trades directly on the chart. Spot the inconsistencies you would never notice in a plain table of numbers.',
    image: '/product-features/on-chart-review.svg',
  },
  {
    title: 'Time-based analytics',
    body: 'See which hours and days you actually make money. Trade more when you win, less when you bleed.',
    image: '/product-features/time-based-analytics.svg',
  },
  {
    title: 'Mentor AI',
    body: 'AI-powered feedback on your trading behavior. Identifies patterns you cannot see yourself — where you overtrade, hesitate, or exit early.',
    image: '/product-features/mentor-ai.svg',
  },
  {
    title: 'Performance Analytics',
    body: 'A clear snapshot of your key metrics and overall performance in one view. See what your edge really looks like — before it costs you money to find out.',
    image: '/product-features/performance-analytics.svg',
  },
]

export function FeaturesMinimal() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight text-center max-w-2xl mx-auto">
        Everything you need. Nothing you don&rsquo;t.
      </h2>

      <ul
        className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
      >
        {features.map((f) => (
          <li
            key={f.title}
            className="rounded-xl border border-border-primary/60 bg-bg-secondary overflow-hidden flex flex-col transition duration-200 hover:-translate-y-1 hover:border-border-primary hover:shadow-2xl"
          >
            <div className="relative aspect-video bg-bg-tertiary overflow-hidden">
              <Image
                src={f.image}
                alt={`${f.title} — product interface screenshot`}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-top"
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-heading font-bold text-lg text-fg-primary">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-fg-secondary leading-relaxed">
                {f.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
