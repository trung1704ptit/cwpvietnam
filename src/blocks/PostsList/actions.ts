'use server'

import { isLocale } from '@/i18n/config'

import { getPostCards, type PostCardsPage, type PostsFilter } from './queries'

const MAX_LIMIT = 24
const MAX_PAGE = 500

const isPositiveInt = (value: unknown, max: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= max

export async function loadPosts(input: {
  filter?: Pick<PostsFilter, 'id' | 'type'> | null
  limit: number
  locale: string
  page: number
}): Promise<PostCardsPage> {
  const { filter, limit, locale, page } = input

  if (!isLocale(locale) || !isPositiveInt(limit, MAX_LIMIT) || !isPositiveInt(page, MAX_PAGE)) {
    throw new Error('Invalid posts request')
  }

  const validFilter =
    filter &&
    (filter.type === 'category' || filter.type === 'tag') &&
    isPositiveInt(filter.id, Number.MAX_SAFE_INTEGER)
      ? { id: filter.id, type: filter.type }
      : null

  return getPostCards({ filter: validFilter, limit, locale, page })
}
