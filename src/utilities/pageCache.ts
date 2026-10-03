import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

import { allLocalePaths } from '@/i18n/paths'

/** Data shared by many pages: post listings (posts index, archive blocks). */
export const POSTS_LIST_TAG = 'posts-list'

/**
 * Caches a Payload query and tags it. Pages rendered with it inherit the tags, so expiring a tag
 * also expires every cached page that used the query.
 */
export const cacheQuery = <T>(fetcher: () => Promise<T>, keyParts: string[], tags: string[]) =>
  unstable_cache(fetcher, keyParts, { tags })()

// Payload hooks also run from the CLI (migrations, seed), where no Next.js cache exists.
const safely = (revalidate: () => void) => {
  try {
    revalidate()
  } catch {}
}

/** The next visitor gets a fresh render; stale content is never served. */
export const expireTag = (tag: string) => safely(() => revalidateTag(tag, { expire: 0 }))

/** Expires one site path in every locale, e.g. `/lien-he` and `/vi/lien-he`. */
export const expireLocalizedPath = (path: string) => {
  for (const localizedPath of allLocalePaths(path)) {
    safely(() => revalidatePath(localizedPath))
  }
}

export const expireAllPages = () => safely(() => revalidatePath('/', 'layout'))
