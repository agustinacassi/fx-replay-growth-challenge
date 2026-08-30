export type Provider = 'email' | 'google'
export type Variant = 'control' | 'variant_a' | 'variant_b'

export type User = {
  id: string
  email: string
  name: string
  provider: Provider
  variant?: Variant
  source?: string
  createdAt: string
}

export type CreateUserInput = {
  email: string
  name: string
  provider: Provider
  variant?: Variant
  source?: string
}

export type UpdateUserInput = Partial<Pick<User, 'name' | 'variant' | 'source'>>

export type ListOptions = {
  limit?: number
  cursor?: string
}

export type ListResult = {
  users: User[]
  nextCursor?: string
}

export interface UserStorage {
  createUser(input: CreateUserInput): Promise<User>
  updateUser(id: string, patch: UpdateUserInput): Promise<User>
  listUsers(opts?: ListOptions): Promise<ListResult>
  getUserByEmail(email: string): Promise<User | null>
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`)
    this.name = 'EmailAlreadyExistsError'
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User "${id}" not found`)
    this.name = 'UserNotFoundError'
  }
}
