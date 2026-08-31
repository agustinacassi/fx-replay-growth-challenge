import Image from 'next/image'
import { AnimatedNumber } from '@/components/AnimatedNumber'

type Emphasis = 'default' | 'featured'

const testimonials = [
  {
    quote:
      'FX Replay is hands down the best backtesting software in the game. I use it all the time, and I’m honestly a little jealous I didn’t have it earlier in my journey.',
    name: 'Mack Grey',
    role: 'Trader',
    avatar: '/people/mack.png',
    // Mack's source portrait has extra headroom — shift focus down so face sits higher in the crop.
    avatarPosition: '50% 35%',
  },
  {
    quote:
      'Anyone can watch a YouTube video or take a course, but FX Replay lets you put what you’ve learned onto a real chart and see what actually works for you.',
    name: 'Ryan Condi',
    role: 'Trader',
    avatar: '/people/ryan.png',
    avatarPosition: '50% 20%',
  },
  {
    quote:
      'Trading always pushes you to improve, and this is the kind of tool that helps you become a better trader.',
    name: 'Dylan Mitch',
    role: 'Trader',
    avatar: '/people/dylan.png',
    avatarPosition: '50% 20%',
  },
]

/**
 * SocialProof — supports two layouts:
 *  - `default`: quote-first, small 40px avatar next to attribution. Used by
 *    the verbose landing where the section is mid-page and has to share weight
 *    with dense assets/indicators sections above and below.
 *  - `featured`: large 96px avatar centered at the top of each card, quote
 *    below. Used by the minimal landing where the section lives near the fold
 *    and needs to carry more visual weight (less content overall, so faces
 *    matter more as trust anchors).
 */
export function SocialProof({ emphasis = 'default' }: { emphasis?: Emphasis } = {}) {
  const isFeatured = emphasis === 'featured'

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">
        <AnimatedNumber to={1_000_000} suffix="+" />{' '}
        traders sharpened their edge here first.
      </h2>
      <p className="mt-4 text-fg-secondary max-w-2xl">
        Practice on real markets before putting real money on the line.
      </p>

      <ul
        className="mt-10 md:mt-12 grid md:grid-cols-3 gap-5"
        role="list"
      >
        {testimonials.map((t) =>
          isFeatured ? (
            <li
              key={t.name}
              className="rounded-xl border border-border-primary/60 bg-bg-secondary overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] bg-bg-tertiary overflow-hidden">
                <Image
                  src={t.avatar}
                  alt={`Portrait of ${t.name}, ${t.role}`}
                  fill
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: t.avatarPosition }}
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <blockquote className="text-fg-primary leading-relaxed flex-1">
                  <span
                    aria-hidden="true"
                    className="text-brand text-2xl leading-none"
                  >
                    &ldquo;
                  </span>{' '}
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-semibold text-fg-primary">{t.name}</div>
                  <div className="text-fg-tertiary text-xs">{t.role}</div>
                </figcaption>
              </div>
            </li>
          ) : (
            <li
              key={t.name}
              className="rounded-xl border border-border-primary/60 bg-bg-secondary p-6 flex flex-col"
            >
              <blockquote className="text-fg-primary leading-relaxed flex-1">
                <span
                  aria-hidden="true"
                  className="text-brand text-2xl leading-none"
                >
                  &ldquo;
                </span>{' '}
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                <Image
                  src={t.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full object-cover flex-none"
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold text-fg-primary">{t.name}</div>
                  <div className="text-fg-tertiary text-xs">{t.role}</div>
                </div>
              </figcaption>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}
