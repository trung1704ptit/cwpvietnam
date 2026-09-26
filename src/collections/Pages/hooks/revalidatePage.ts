import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

const isHomePage = async (id: Page['id'] | undefined, req: PayloadRequest) => {
  if (!id) return false

  const { homePage } = await req.payload.findGlobal({ slug: 'settings', depth: 0, req })
  const homePageId = homePage && typeof homePage === 'object' ? homePage.id : homePage

  return homePageId === id
}

const revalidatePagePaths = async (doc: Page, req: PayloadRequest) => {
  const paths = [`/${doc.slug}`]
  if (await isHomePage(doc.id, req)) paths.push('/')

  for (const path of paths) {
    req.payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }
  revalidateTag('pages-sitemap', 'max')
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    if (doc._status === 'published') {
      await revalidatePagePaths(doc, req)
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      await revalidatePagePaths(previousDoc, req)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req }) => {
  if (!req.context.disableRevalidate && doc) {
    await revalidatePagePaths(doc, req)
  }

  return doc
}
