import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import type { Page } from '../../../payload-types'
import { expireAllPages, expireTag } from '@/utilities/pageCache'
import { revalidateDocument } from '@/utilities/revalidateDocument'

const isHomePage = async (id: Page['id'] | undefined, req: PayloadRequest) => {
  if (!id) return false

  const { homePage } = await req.payload.findGlobal({ slug: 'settings', depth: 0, req })
  const homePageId = homePage && typeof homePage === 'object' ? homePage.id : homePage

  return homePageId === id
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    // Draft saves don't change what visitors see, only publishing and unpublishing do.
    if (doc._status === 'published' || previousDoc?._status === 'published') {
      await revalidateDocument({
        collection: 'pages',
        doc,
        isHomePage: await isHomePage(doc.id, req),
        previousDoc,
        req,
      })
      expireTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req }) => {
  if (!req.context.disableRevalidate && doc) {
    expireAllPages()
    expireTag('pages-sitemap')
  }

  return doc
}
