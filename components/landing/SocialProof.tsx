const testimonials = [
  {
    quote:
      'FX Replay is hands down the best backtesting software in the game. I use it all the time, and I’m honestly a little jealous I didn’t have it earlier in my journey.',
    name: 'Mack Grey',
    role: 'Trader',
  },
  {
    quote:
      'Anyone can watch a YouTube video or take a course, but FX Replay lets you put what you’ve learned onto a real chart and see what actually works for you.',
    name: 'Ryan Condi',
    role: 'Trader',
  },
  {
    quote:
      'Trading always pushes you to improve, and this is the kind of tool that helps you become a better trader.',
    name: 'Dylan Mitch',
    role: 'Trader',
  },
]

export function SocialProof() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-border-primary/50">
      <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">
        1,000,000+ traders sharpened their edge here first.
      </h2>
      <p className="mt-4 text-fg-secondary max-w-2xl">
        Practice on real markets before putting real money on the line.
      </p>

      <ul
        className="mt-10 md:mt-12 grid md:grid-cols-3 gap-5"
        role="list"
      >
        {testimonials.map((t) => (
          <li
            key={t.name}
            className="rounded-xl border border-border-primary/60 bg-bg-secondary p-6 flex flex-col"
          >
            <blockquote className="text-fg-primary leading-relaxed flex-1">
              <span aria-hidden="true" className="text-brand text-2xl leading-none">
                &ldquo;
              </span>{' '}
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-fg-primary">— {t.name}</span>
              <span className="text-fg-tertiary">, {t.role}</span>
            </figcaption>
          </li>
        ))}
      </ul>
    </section>
  )
}
