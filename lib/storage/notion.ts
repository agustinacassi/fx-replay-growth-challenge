import { Client } from '@notionhq/client'
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

type NotionProps = Record<string, unknown>

/**
 * Notion-backed storage. Uses the official @notionhq/client SDK against a
 * database whose schema was created by the setup script (see JOURNAL.md).
 *
 * Column mapping:
 *   Email    (title)
 *   Name     (rich_text)
 *   Provider (select: email | google)
 *   Variant  (select: control | variant_a | variant_b)
 *   Source   (rich_text)
 *   Created  (created_time — auto)
 *   User ID  (auto_increment)
 *
 * We treat the Notion page id as the user id externally.
 */
export class NotionStorage implements UserStorage {
  private client: Client
  private databaseId: string

  constructor(token: string, databaseId: string) {
    this.client = new Client({ auth: token })
    this.databaseId = databaseId
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.getUserByEmail(input.email)
    if (existing) throw new EmailAlreadyExistsError(input.email)

    const properties: NotionProps = {
      Email: { title: [{ text: { content: input.email.toLowerCase() } }] },
      Name: { rich_text: [{ text: { content: input.name } }] },
      Provider: { select: { name: input.provider } },
    }
    if (input.variant) properties.Variant = { select: { name: input.variant } }
    if (input.source) properties.Source = { rich_text: [{ text: { content: input.source } }] }

    const page = await this.client.pages.create({
      parent: { database_id: this.databaseId },
      properties: properties as never,
    })

    return this.pageToUser(page as never)
  }

  async updateUser(id: string, patch: UpdateUserInput): Promise<User> {
    const properties: NotionProps = {}
    if (patch.name !== undefined)
      properties.Name = { rich_text: [{ text: { content: patch.name } }] }
    if (patch.variant !== undefined) properties.Variant = { select: { name: patch.variant } }
    if (patch.source !== undefined)
      properties.Source = { rich_text: [{ text: { content: patch.source } }] }

    try {
      const page = await this.client.pages.update({
        page_id: id,
        properties: properties as never,
      })
      return this.pageToUser(page as never)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('not found') || message.includes('Could not find')) {
        throw new UserNotFoundError(id)
      }
      throw err
    }
  }

  async listUsers(opts: ListOptions = {}): Promise<ListResult> {
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      page_size: Math.min(opts.limit ?? 50, 100),
      start_cursor: opts.cursor,
      sorts: [{ property: 'Created', direction: 'descending' }],
    })
    return {
      users: response.results.map((r) => this.pageToUser(r as never)),
      nextCursor: response.next_cursor ?? undefined,
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Email',
        title: { equals: email.toLowerCase() },
      },
      page_size: 1,
    })
    const first = response.results[0]
    return first ? this.pageToUser(first as never) : null
  }

  private pageToUser(page: {
    id: string
    created_time: string
    properties: Record<string, unknown>
  }): User {
    const props = page.properties as Record<string, { [k: string]: unknown }>
    const email = readTitle(props.Email) ?? ''
    const name = readRichText(props.Name) ?? ''
    const provider = readSelect(props.Provider) as User['provider']
    const variant = readSelect(props.Variant) as User['variant'] | undefined
    const source = readRichText(props.Source)

    return {
      id: page.id,
      email,
      name,
      provider: provider ?? 'email',
      variant,
      source: source ?? undefined,
      createdAt: page.created_time,
    }
  }
}

function readTitle(prop: unknown): string | null {
  const p = prop as { title?: Array<{ plain_text?: string }> } | undefined
  return p?.title?.map((t) => t.plain_text ?? '').join('') || null
}

function readRichText(prop: unknown): string | null {
  const p = prop as { rich_text?: Array<{ plain_text?: string }> } | undefined
  return p?.rich_text?.map((t) => t.plain_text ?? '').join('') || null
}

function readSelect(prop: unknown): string | null {
  const p = prop as { select?: { name?: string } | null } | undefined
  return p?.select?.name ?? null
}
