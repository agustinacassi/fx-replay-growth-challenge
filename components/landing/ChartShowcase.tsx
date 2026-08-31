import Image from 'next/image'

/**
 * Product screenshot band — used by the minimal landing variant to substitute
 * removed sections (Assets, Indicators, 15-feature carousel) with a single
 * high-signal visual. The image is a real screenshot of the FX Replay chart
 * interface — signals "this is the product you'll use" without paragraphs.
 */
export function ChartShowcase() {
  return (
    <section
      aria-labelledby="chart-showcase-title"
      className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-border-primary/50"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2
          id="chart-showcase-title"
          className="text-3xl md:text-4xl font-black leading-tight"
        >
          This is the chart you’ll practice on.
        </h2>
        <p className="mt-3 text-fg-secondary">
          Real market data, TradingView-powered candles, every timeframe from
          1-second to monthly.
        </p>
      </div>

      <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden shadow-2xl">
        <Image
          src="/product-chart.png"
          alt="Screenshot of the FX Replay chart interface showing EUR/USD 1-hour candles on Pepperstone data with volume bars and price ladder."
          width={2000}
          height={1200}
          priority={false}
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="w-full h-auto"
        />
      </div>
    </section>
  )
}
