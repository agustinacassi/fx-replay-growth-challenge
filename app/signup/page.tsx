import type { Metadata } from 'next'
import { Header } from '@/components/landing/Header'
import { SignupForm } from '@/components/signup/SignupForm'
import { SignupViewedTracker } from '@/components/signup/SignupViewedTracker'

export const metadata: Metadata = {
  title: 'Start free — FX Replay',
  description:
    'Create your free FX Replay account. No credit card. Never expires. Backtest immediately.',
  robots: { index: false, follow: false },
}

const trustBullets = [
  'No credit card required.',
  'Free tier never expires.',
  'No auto-billing. Ever.',
  'Cancel is nothing to cancel — it’s just free.',
]

/**
 * Signup page. Renders a header, the form (client), and a small trust
 * panel that repeats the promises the landing made. Both server-heavy —
 * only the form + trackers are interactive.
 */
export default function SignupPage() {
  const variant = 'control'

  return (
    <>
      <SignupViewedTracker variant={variant} />
      <Header />
      <main
        id="main"
        className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[1fr_minmax(0,420px)] gap-12 md:gap-20 items-start"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight max-w-lg">
            Start practicing in 30 seconds.
          </h1>
          <p className="mt-4 text-fg-secondary max-w-md">
            One step. No card. No pricing to pick. You’ll be backtesting your
            first strategy the moment you sign in.
          </p>

          <ul className="mt-10 space-y-3 text-sm text-fg-secondary max-w-md" role="list">
            {trustBullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckIcon />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 md:p-8 shadow-xl">
          <SignupForm variant={variant} />
        </div>
      </main>
    </>
  )
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 flex-none text-[color:var(--text-success)]"
    >
      <path
        d="M5 12l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
