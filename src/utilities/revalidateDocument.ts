import type { PayloadRequest } from 'payload'

import { expireAllPages, expireLocalizedPath } from './pageCache'

type RoutedCollection = 'pages' | 'posts'

type RoutedDoc = {
  _status?: 'draft' | 'published' | null
  id: number
  slug?: string | null
}

const basePaths: Record<RoutedCollection, string> = {
  pages: '',
  posts: '/posts',
}

/** Slugs are localized, so a document can live at a different path in every locale. */
const getSlugsInAllLocales = async (
  collection: RoutedCollection,
  id: number,
  req: PayloadRequest,
): Promise<string[]> => {
  const doc = await req.payload.findByID({
    collection,
    depth: 0,
    disableErrors: true,
    id,
    locale: 'all',
    req,
    select: { slug: true },
  })
  const slug = (doc as { slug?: Record<string, string | null> | string | null } | null)?.slug

  if (!slug) return []
  if (typeof slug === 'string') return [slug]
  return Object.values(slug).filter((value): value is string => Boolean(value))
}

/**
 * Expires the cached pages that render this document, in every locale and under every slug it
 * has had. A changed slug or publish status also changes links elsewhere (menus, listings,
 * redirects), so every page is expired in that case.
 */
export const revalidateDocument = async ({
  collection,
  doc,
  isHomePage = false,
  previousDoc,
  req,
}: {
  collection: RoutedCollection
  doc: RoutedDoc
  isHomePage?: boolean
  previousDoc?: RoutedDoc
  req: PayloadRequest
}) => {
  if (previousDoc && (previousDoc.slug !== doc.slug || previousDoc._status !== doc._status)) {
    req.payload.logger.info(`Revalidating all pages after ${collection} ${doc.id} changed its URL`)
    expireAllPages()
    return
  }

  const slugs = new Set(
    [...(await getSlugsInAllLocales(collection, doc.id, req)), doc.slug].filter(
      (slug): slug is string => Boolean(slug),
    ),
  )

  for (const slug of slugs) {
    const path = `${basePaths[collection]}/${slug}`
    req.payload.logger.info(`Revalidating ${collection} at path: ${path}`)
    expireLocalizedPath(path)
  }

  if (isHomePage) expireLocalizedPath('/')
}
