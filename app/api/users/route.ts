import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/lib/storage'
import { handleError } from '@/lib/api/errors'
import { createUserSchema, listQuerySchema } from '@/lib/api/schemas'

export const runtime = 'nodejs'

/** POST /api/users — create a new user. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const input = createUserSchema.parse(body)
    const user = await getStorage().createUser(input)
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}

/** GET /api/users?limit=&cursor= — list users, newest first. */
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries())
    const query = listQuerySchema.parse(params)
    const result = await getStorage().listUsers(query)
    return NextResponse.json(result)
  } catch (err) {
    return handleError(err)
  }
}
