import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { expireAllPages } from '@/utilities/pageCache'

/**
 * For content embedded in many pages (media, team members, categories, forms), where tracking
 * which pages use a document is not worth it.
 */
export const revalidateAllPagesAfterChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    req.payload.logger.info(`Revalidating all pages after ${collection.slug} ${doc.id} changed`)
    expireAllPages()
  }
  return doc
}

export const revalidateAllPagesAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) expireAllPages()
  return doc
}
