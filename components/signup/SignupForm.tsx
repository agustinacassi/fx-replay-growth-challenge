'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useId, useRef, useState } from 'react'
import { track } from '@/lib/analytics/track'
import type { Provider, Variant } from '@/lib/analytics/events'

type FieldErrors = Partial<Record<'email' | 'name', string>>

type Props = {
  variant?: Variant
}

/**
 * One-step signup — no billing, no pricing gate. Wires the funnel:
 *   signup_started (first field focus)
 *   signup_submitted (before API call)
 *   signup_succeeded (2xx from /api/users)
 *   signup_failed (validation | network | api)
 *
 * The Google button is a simulated OAuth outcome — it generates a plausible
 * fake identity and posts to the same API so downstream analytics and Notion
 * rows work identically. Documented in trade-offs.
 */
export function SignupForm({ variant = 'control' }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState<Provider | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const startedRef = useRef(false)

  const emailId = useId()
  const nameId = useId()
  const emailErrorId = useId()
  const nameErrorId = useId()
  const formErrorId = useId()

  const fireStartedOnce = useCallback(
    (provider: Provider) => {
      if (startedRef.current) return
      startedRef.current = true
      track('signup_started', { provider, variant })
    },
    [variant],
  )

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    // Client-side validation first — cheap check, better UX than round-trip.
    const localErrors: FieldErrors = {}
    if (!email.trim()) localErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      localErrors.email = 'Enter a valid email address.'
    if (!name.trim()) localErrors.name = 'Your name is required.'

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors)
      setFormError(null)
      track('signup_failed', {
        provider: 'email',
        variant,
        error_code: 'validation_error',
        stage: 'validation',
      })
      return
    }

    await submit('email', { email: email.trim(), name: name.trim() })
  }

  const submitGoogle = async () => {
    if (loading) return
    fireStartedOnce('google')
    // Simulated Google identity — makes the "google" branch of the funnel
    // observable end-to-end (event + Notion row) without integrating real OAuth.
    const suffix = Math.random().toString(36).slice(2, 8)
    await submit('google', {
      email: `google-user-${suffix}@fxreplay.demo`,
      name: `Google User ${suffix.toUpperCase()}`,
    })
  }

  const submit = async (
    provider: Provider,
    payload: { email: string; name: string },
  ) => {
    setLoading(provider)
    setFormError(null)
    setFieldErrors({})
    track('signup_submitted', { provider, variant })

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, provider, variant }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const code = body?.error?.code ?? `http_${res.status}`
        const message = body?.error?.message ?? 'Something went wrong. Try again.'
        track('signup_failed', { provider, variant, error_code: code, stage: 'api' })

        if (code === 'email_already_exists') {
          setFieldErrors({ email: 'An account with this email already exists.' })
        } else if (code === 'validation_error' && body?.error?.details) {
          const details = body.error.details as Record<string, string[]>
          setFieldErrors({
            email: details.email?.[0],
            name: details.name?.[0],
          })
        } else {
          setFormError(message)
        }
        setLoading(null)
        return
      }

      const body = await res.json()
      const userId = body.user.id as string

      track('signup_succeeded', { provider, variant, user_id: userId })

      const params = new URLSearchParams({
        u: userId,
        p: provider,
        v: variant,
      })
      router.push(`/welcome?${params.toString()}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error.'
      track('signup_failed', {
        provider,
        variant,
        error_code: 'network_error',
        stage: 'network',
      })
      setFormError(`Couldn’t reach the server: ${message}`)
      setLoading(null)
    }
  }

  const busy = loading !== null

  return (
    <form
      onSubmit={submitEmail}
      noValidate
      aria-describedby={formError ? formErrorId : undefined}
      className="space-y-5"
    >
      <button
        type="button"
        onClick={submitGoogle}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-border-primary bg-bg-secondary hover:bg-bg-tertiary text-fg-primary font-semibold px-5 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
      >
        <GoogleGlyph />
        {loading === 'google' ? 'Signing you in…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-fg-tertiary">
        <span className="flex-1 h-px bg-border-primary/70" />
        or
        <span className="flex-1 h-px bg-border-primary/70" />
      </div>

      <div>
        <label
          htmlFor={emailId}
          className="block text-sm font-semibold text-fg-secondary mb-1.5"
        >
          Email
        </label>
        <input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          disabled={busy}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => fireStartedOnce('email')}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? emailErrorId : undefined}
          className="w-full rounded-lg bg-bg-secondary border border-border-primary px-4 py-3 text-fg-primary placeholder:text-fg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] disabled:opacity-60"
          placeholder="you@example.com"
        />
        {fieldErrors.email && (
          <p id={emailErrorId} role="alert" className="mt-1.5 text-sm text-[color:var(--text-danger)]">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={nameId}
          className="block text-sm font-semibold text-fg-secondary mb-1.5"
        >
          Your name
        </label>
        <input
          id={nameId}
          type="text"
          autoComplete="name"
          required
          disabled={busy}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => fireStartedOnce('email')}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? nameErrorId : undefined}
          className="w-full rounded-lg bg-bg-secondary border border-border-primary px-4 py-3 text-fg-primary placeholder:text-fg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] disabled:opacity-60"
          placeholder="Alex Rivera"
        />
        {fieldErrors.name && (
          <p id={nameErrorId} role="alert" className="mt-1.5 text-sm text-[color:var(--text-danger)]">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {formError && (
        <p id={formErrorId} role="alert" className="text-sm text-[color:var(--text-danger)] bg-[color:var(--text-danger)]/10 border border-[color:var(--text-danger)]/30 rounded-lg px-4 py-3">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full inline-flex items-center justify-center bg-brand hover:bg-[color:var(--btn-bg-primary-hover)] text-[color:var(--btn-fg-primary)] font-semibold px-5 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-primary)]"
      >
        {loading === 'email' ? 'Creating your account…' : 'Continue with email'}
      </button>

      <p className="text-xs text-fg-tertiary text-center">
        By continuing you agree to our terms. No card. No auto-billing. Ever.
      </p>
    </form>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}
