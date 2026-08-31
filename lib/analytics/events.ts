/**
 * Analytics taxonomy — single source of truth.
 *
 * Every user-visible action MUST have its event defined here. Use the
 * `/add-tracked-event` command to add new events (it keeps this file, the
 * doc in docs/analytics.md, and the trigger site in sync).
 *
 * Naming convention: `<surface>_<action>` in snake_case. Enum-like props
 * use string literal unions instead of `string` so drift is caught by the
 * compiler.
 */

/** Surface identifiers used across events. */
export type Surface = 'landing' | 'signup' | 'welcome'

/** Location of a CTA within a surface. */
export type CtaLocation =
  | 'hero'
  | 'sticky_nav'
  | 'features'
  | 'footer'
  | 'inline'
  | 'header_secondary' // "Sign in" link in the header
  | 'header_cta' // "Get Started" primary button in the header

/** How the user signed up. */
export type Provider = 'email' | 'google'

/** A/B experiment variant, always present so events can be sliced by group. */
export type Variant = 'control' | 'variant_a' | 'variant_b'

/**
 * The full event catalog. Left side is the event name (fired via `track`);
 * right side is the exact props shape required at the call site.
 */
export type Events = {
  /** Fired when the landing page mounts. */
  landing_viewed: {
    variant: Variant
    /** Value of ?utm_source, if present. */
    utm_source?: string
    /** document.referrer at mount time, if present. */
    referrer?: string
  }

  /** Fired when the signup page or modal is opened. */
  signup_viewed: {
    variant: Variant
    /** Which CTA on the landing brought the user here. */
    from_location?: CtaLocation
  }

  /** Fired when the welcome page mounts (successful conversion). */
  welcome_viewed: {
    user_id: string
    provider: Provider
    variant: Variant
  }

  /** Fired when any primary/secondary CTA is clicked. */
  cta_clicked: {
    location: CtaLocation
    label: string
    variant: Variant
    /** Destination — a path, `signup_modal`, `external:<url>`, etc. */
    destination: string
  }

  /** Fired when the user focuses the first signup field (intent signal). */
  signup_started: {
    provider: Provider
    variant: Variant
  }

  /** Fired when the signup form is submitted (before the API call). */
  signup_submitted: {
    provider: Provider
    variant: Variant
  }

  /** Fired after a 2xx response from POST /api/users. */
  signup_succeeded: {
    provider: Provider
    variant: Variant
    user_id: string
  }

  /** Fired after a non-2xx response or client-side validation failure. */
  signup_failed: {
    provider: Provider
    variant: Variant
    /** Machine-readable code — matches the API error envelope. */
    error_code: string
    /** Where the failure happened. */
    stage: 'validation' | 'network' | 'api'
  }

  /** Fired when the user clicks a next-step CTA on the welcome page. */
  welcome_next_step_clicked: {
    step: string
    user_id: string
  }

  /**
   * Fired when a PostHog feature flag is first evaluated for the user.
   * Lets us confirm the variant assignment on the funnel side.
   */
  experiment_variant_assigned: {
    flag_key: string
    variant: string
  }

  /** Fired when the user opens or closes a FAQ item on the landing. */
  faq_toggled: {
    question: string
    opened: boolean
    variant: Variant
  }
}

/** Union of all valid event names. */
export type EventName = keyof Events

/** Props shape for a given event. */
export type EventProps<E extends EventName> = Events[E]
