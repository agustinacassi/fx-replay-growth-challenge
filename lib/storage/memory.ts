import {
  CreateUserInput,
  EmailAlreadyExistsError,
  ListOptions,
  ListResult,
  UpdateUserInput,
  User,
  UserNotFoundError,
  UserStorage,
} from './types'

/**
 * In-memory storage. State lives in a module-level Map so it survives across
 * requests within the same Node process (Next dev server, single Vercel Lambda
 * instance) but resets on cold start. Intended for local dev and as a fallback
 * when Notion credentials are not configured.
 */
export class InMemoryStorage implements UserStorage {
  private users = new Map<string, User>()

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.getUserByEmail(input.email)
    if (existing) throw new EmailAlreadyExistsError(input.email)

    const user: User = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      email: input.email.toLowerCase(),
      name: input.name,
      provider: input.provider,
      variant: input.variant,
      source: input.source,
      createdAt: new Date().toISOString(),
    }
    this.users.set(user.id, user)
    return user
  }

  async updateUser(id: string, patch: UpdateUserInput): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new UserNotFoundError(id)
    const updated: User = { ...user, ...patch }
    this.users.set(id, updated)
    return updated
  }

  async listUsers(opts: ListOptions = {}): Promise<ListResult> {
    const limit = Math.min(opts.limit ?? 50, 100)
    const all = Array.from(this.users.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
    const start = opts.cursor ? Number(opts.cursor) : 0
    const page = all.slice(start, start + limit)
    const nextCursor = start + limit < all.length ? String(start + limit) : undefined
    return { users: page, nextCursor }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase()
    for (const user of this.users.values()) {
      if (user.email === normalized) return user
    }
    return null
  }
}
