import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fx-replay-growth-challenge.vercel.app'

/**
 * Sitemap for search engines. Only `/` is indexable — `/signup` and `/welcome`
 * both set `robots: { index: false }` in their `metadata`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date('2026-08-31'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
