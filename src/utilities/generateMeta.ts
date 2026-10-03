import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    url = serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** Falls back to the plain site title instead of the page title. */
  isHomePage?: boolean
}): Promise<Metadata> => {
  const { doc, isHomePage } = args

  const ogImage = getImageURL(doc?.meta?.image)

  // The root layout's title template appends the site title from Settings.
  const title =
    doc?.meta?.title?.trim() || (isHomePage ? undefined : doc?.title?.trim()) || undefined

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      ...(title ? { title } : {}),
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    // An explicit `undefined` would also drop the layout's default title.
    ...(title ? { title } : {}),
  }
}
