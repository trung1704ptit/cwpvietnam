import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import type { Media, Post } from '@/payload-types'
import { cacheQuery, POSTS_LIST_TAG } from '@/utilities/pageCache'

export type PostsFilter = { id: number; title: string; type: 'category' | 'tag' }

export type PostCardData = {
  authors: string[]
  categories: { id: number; title: string }[]
  description: string | null
  id: number
  image: Media | null
  publishedAt: string | null
  slug: string
  title: string
}

export type PostCardsPage = { docs: PostCardData[]; hasNextPage: boolean; totalDocs: number }

export type TaxonomyItem = { count: number; id: number; title: string }

export type PostsTaxonomy = {
  categories: TaxonomyItem[]
  tags: TaxonomyItem[]
}

const toCardData = (post: Partial<Post>): PostCardData => {
  const image = [post.heroImage, post.meta?.image].find(
    (media): media is Media => typeof media === 'object' && media !== null,
  )

  return {
    authors: (post.populatedAuthors ?? []).flatMap((author) => (author.name ? [author.name] : [])),
    categories: (post.categories ?? []).flatMap((category) =>
      typeof category === 'object' && category ? [{ id: category.id, title: category.title }] : [],
    ),
    description: post.shortDescription || post.meta?.description || null,
    id: post.id!,
    image: image ?? null,
    publishedAt: post.publishedAt ?? null,
    slug: post.slug ?? '',
    title: post.title ?? '',
  }
}

const filterToWhere = (filter?: Pick<PostsFilter, 'id' | 'type'> | null): Where | undefined => {
  if (!filter) return undefined
  return filter.type === 'category'
    ? { categories: { in: [filter.id] } }
    : { tags: { in: [filter.id] } }
}

export const getPostCards = ({
  filter,
  limit,
  locale,
  page,
}: {
  filter?: Pick<PostsFilter, 'id' | 'type'> | null
  limit: number
  locale: Locale
  page: number
}): Promise<PostCardsPage> =>
  cacheQuery(
    async () => {
      const payload = await getPayload({ config: configPromise })

      const result = await payload.find({
        collection: 'posts',
        depth: 1,
        limit,
        locale,
        overrideAccess: false,
        page,
        select: {
          authors: true,
          categories: true,
          heroImage: true,
          meta: { description: true, image: true },
          populatedAuthors: true,
          publishedAt: true,
          shortDescription: true,
          slug: true,
          title: true,
        },
        sort: '-publishedAt',
        where: filterToWhere(filter),
      })

      return {
        docs: result.docs.map(toCardData),
        hasNextPage: result.hasNextPage,
        totalDocs: result.totalDocs,
      }
    },
    [
      'posts-list-block',
      locale,
      String(limit),
      String(page),
      filter ? `${filter.type}:${filter.id}` : 'all',
    ],
    [POSTS_LIST_TAG],
  )

/** All categories and tags, with their published post counts. */
export const getPostsTaxonomy = (locale: Locale): Promise<PostsTaxonomy> =>
  cacheQuery(
    async () => {
      const payload = await getPayload({ config: configPromise })

      const [taxonomyOfPosts, categories, tags] = await Promise.all([
        payload.find({
          collection: 'posts',
          depth: 0,
          locale,
          overrideAccess: false,
          pagination: false,
          select: { categories: true, tags: true },
        }),
        payload.find({
          collection: 'categories',
          depth: 0,
          locale,
          pagination: false,
          select: { title: true },
          sort: 'title',
        }),
        payload.find({
          collection: 'tags',
          depth: 0,
          locale,
          pagination: false,
          select: { title: true },
          sort: 'title',
        }),
      ])

      const countIds = (key: 'categories' | 'tags') => {
        const counts = new Map<number, number>()
        for (const post of taxonomyOfPosts.docs) {
          for (const item of post[key] ?? []) {
            const id = typeof item === 'object' ? item.id : item
            counts.set(id, (counts.get(id) ?? 0) + 1)
          }
        }
        return counts
      }

      const withCounts = (docs: { id: number; title: string }[], counts: Map<number, number>) =>
        docs.map(({ id, title }) => ({ count: counts.get(id) ?? 0, id, title }))

      return {
        categories: withCounts(categories.docs, countIds('categories')),
        tags: withCounts(tags.docs, countIds('tags')),
      }
    },
    ['posts-list-taxonomy', locale],
    [POSTS_LIST_TAG],
  )
