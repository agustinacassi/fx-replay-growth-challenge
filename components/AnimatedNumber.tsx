'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** The final value to animate to. */
  to: number
  /** How long the count-up takes, in milliseconds. Default 1500. */
  duration?: number
  /** Optional suffix appended to the formatted number (e.g. `+`, `k`, `M`). */
  suffix?: string
  /** Optional class name for the outer span. */
  className?: string
}

/**
 * Counts up from 0 to `to` once the element enters the viewport. Uses
 * `requestAnimationFrame` with an ease-out curve so the number "lands" on the
 * final value smoothly. Respects `prefers-reduced-motion` — if reduced, jumps
 * straight to the final value on first mount.
 */
export function AnimatedNumber({ to, duration = 1500, suffix = '', className }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setValue(to)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return
          startedRef.current = true
          io.disconnect()

          const start = performance.now()
          const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic — decelerates as it approaches the target
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(to * eased))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        })
      },
      { threshold: 0.3 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span
      ref={ref}
      className={className}
      // aria-live off — the final rendered text is stable and gets announced
      // by SR naturally once the DOM settles; announcing intermediate values
      // would be spammy.
      aria-hidden={value < to ? 'true' : undefined}
    >
      {value.toLocaleString('en-US')}
      {suffix}
      {/* SR-only fallback so screen readers get the final value even before animation completes */}
      {value < to && <span className="sr-only">{to.toLocaleString('en-US')}{suffix}</span>}
    </span>
  )
}
