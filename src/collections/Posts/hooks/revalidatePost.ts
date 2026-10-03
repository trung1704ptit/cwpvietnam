import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '../../../payload-types'
import { expireAllPages, expireTag, POSTS_LIST_TAG } from '@/utilities/pageCache'
import { revalidateDocument } from '@/utilities/revalidateDocument'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    // Draft saves don't change what visitors see, only publishing and unpublishing do.
    if (doc._status === 'published' || previousDoc?._status === 'published') {
      await revalidateDocument({ collection: 'posts', doc, previousDoc, req })
      // Post listings show titles, images and descriptions.
      expireTag(POSTS_LIST_TAG)
      expireTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    expireAllPages()
    expireTag('posts-sitemap')
  }

  return doc
}
