import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'FX Replay — Practice trading strategies before you risk a dollar.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Dynamically-generated Open Graph image (1200x630, PNG). Rendered at request
 * time via `next/og`'s Satori. Text-only, brand-consistent — no external
 * assets, no fonts to bundle beyond system-safe.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'radial-gradient(120% 140% at 15% 0%, rgba(2,96,253,0.25), transparent 55%), #030303',
          color: '#F6F6F6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.14em',
            color: '#F6F6F6',
          }}
        >
          FX REPLAY
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: 960,
            }}
          >
            Practice trading strategies before you risk a dollar.
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#D1D1D1',
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Backtest on real forex markets. Free forever, no card required.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 24,
            fontSize: 16,
            color: '#888888',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>120+ ASSETS</span>
          <span style={{ color: '#333' }}>·</span>
          <span>20+ YEARS OF DATA</span>
          <span style={{ color: '#333' }}>·</span>
          <span>TRAINED BY 1M+ TRADERS</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
