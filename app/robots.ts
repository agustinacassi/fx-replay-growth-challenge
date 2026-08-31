import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fx-replay-growth-challenge.vercel.app'

/**
 * robots.txt — allow crawlers on the marketing landing, disallow the
 * post-signup surfaces (defense in depth on top of per-route `noindex`).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/signup', '/welcome', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
