import { NextRequest, NextResponse } from 'next/server'
import { getStorage } from '@/lib/storage'
import { handleError, errorResponse } from '@/lib/api/errors'
import { updateUserSchema } from '@/lib/api/schemas'

export const runtime = 'nodejs'

/** PATCH /api/users/[id] — partial update of an existing user. */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params
    if (!id) return errorResponse('missing_id', 'User id is required.', 400)

    const body = await req.json().catch(() => ({}))
    const patch = updateUserSchema.parse(body)
    const user = await getStorage().updateUser(id, patch)
    return NextResponse.json({ user })
  } catch (err) {
    return handleError(err)
  }
}
