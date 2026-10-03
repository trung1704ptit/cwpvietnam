import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { defaultLocale, isLocale } from '@/i18n/config'
import { localizePath } from '@/i18n/paths'
import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)
  const locale = isLocale(req.locale) ? req.locale : defaultLocale

  const encodedParams = new URLSearchParams({
    path: localizePath(`${collectionPrefixMap[collection]}/${encodedSlug}`, locale),
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
