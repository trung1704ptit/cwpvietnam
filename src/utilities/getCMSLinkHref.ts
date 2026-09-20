import type { Page, Post } from '@/payload-types'

type CMSLinkHrefArgs = {
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const getCMSLinkHref = ({ type, reference, url }: CMSLinkHrefArgs): string | null => {
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    return `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
  }

  return url || null
}
