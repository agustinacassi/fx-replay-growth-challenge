import { InMemoryStorage } from './memory'
import { NotionStorage } from './notion'
import type { UserStorage } from './types'

export * from './types'

let cached: UserStorage | null = null

/**
 * Selects the storage adapter based on env. Called at request time; the result
 * is cached per process. If NOTION_TOKEN + NOTION_SIGNUPS_DB_ID are both set,
 * uses Notion. Otherwise falls back to in-memory (dev/reviewer convenience).
 */
export function getStorage(): UserStorage {
  if (cached) return cached

  const token = process.env.NOTION_TOKEN
  const dbId = process.env.NOTION_SIGNUPS_DB_ID

  if (token && dbId) {
    console.info('[storage] using NotionStorage')
    cached = new NotionStorage(token, dbId)
  } else {
    console.info('[storage] using InMemoryStorage (Notion env not configured)')
    cached = new InMemoryStorage()
  }
  return cached
}
