import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { expireTag, POSTS_LIST_TAG } from '@/utilities/pageCache'

/** For documents shown inside cached post listings (categories, tags, images). */
export const revalidatePostsListAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) expireTag(POSTS_LIST_TAG)
  return doc
}

export const revalidatePostsListAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) expireTag(POSTS_LIST_TAG)
  return doc
}
