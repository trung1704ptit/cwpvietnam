import type { Page, Post } from '@/payload-types'

type CMSLinkHrefArgs = {
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const getDocHref = (relationTo: string, slug: string) =>
  // The home page's slug is `/`.
  `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${slug}`.replace(/^\/{2,}/, '/')

export const getCMSLinkHref = ({ type, reference, url }: CMSLinkHrefArgs): string | null => {
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    return getDocHref(reference.relationTo, reference.value.slug)
  }

  return url || null
}
