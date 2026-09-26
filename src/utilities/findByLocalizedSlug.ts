import configPromise from '@payload-config'
import { getPayload, type CollectionSlug, type TypedLocale } from 'payload'

import { defaultLocale, locales, type Locale } from '@/i18n/config'

type Args = {
  collection: CollectionSlug
  draft?: boolean
  locale: Locale
  slug: string
}

export async function findByLocalizedSlug<T = unknown>({
  collection,
  draft = false,
  locale,
  slug,
}: Args): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })

  const findInLocale = async (queryLocale: TypedLocale) => {
    const result = await payload.find({
      collection,
      draft,
      fallbackLocale: false,
      limit: 1,
      locale: queryLocale,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] ?? null
  }

  const match = await findInLocale(locale)
  if (match && typeof match === 'object' && 'id' in match) {
    const localized = await payload.findByID({
      collection,
      draft,
      fallbackLocale: locale === defaultLocale ? false : defaultLocale,
      id: match.id as string | number,
      locale,
      overrideAccess: draft,
    })

    return (localized as T) ?? null
  }

  for (const otherLocale of locales) {
    if (otherLocale === locale) continue

    const found = await findInLocale(otherLocale)
    if (!found || typeof found !== 'object' || !('id' in found)) continue

    const localized = await payload.findByID({
      collection,
      draft,
      fallbackLocale: otherLocale,
      id: found.id as string | number,
      locale,
      overrideAccess: draft,
    })

    return (localized as T) ?? null
  }

  return null
}
