import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { EmailAlreadyExistsError, UserNotFoundError } from '@/lib/storage/types'

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message, details } }, { status })
}

/** Central handler — converts thrown errors to consistent HTTP envelopes. */
export function handleError(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof ZodError) {
    return errorResponse(
      'validation_error',
      'Request body failed validation.',
      400,
      err.flatten().fieldErrors,
    )
  }
  if (err instanceof EmailAlreadyExistsError) {
    return errorResponse('email_already_exists', err.message, 409)
  }
  if (err instanceof UserNotFoundError) {
    return errorResponse('user_not_found', err.message, 404)
  }
  // Never leak the raw error message — it may contain credentials, tokens,
  // or SDK-internal detail. Log server-side; return a generic envelope.
  console.error('[api] unhandled error', err)
  return errorResponse('internal_error', 'Something went wrong. Please try again.', 500)
}
