import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Search } from '@/search/Component'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { cacheQuery, POSTS_LIST_TAG } from '@/utilities/pageCache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { HeaderTheme } from './HeaderTheme'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 12

type Args = {
  params: Promise<{
    pageNumber?: string
  }>
}

const getPostsPage = (locale: Locale, page: number) =>
  cacheQuery(
    async () => {
      const payload = await getPayload({ config: configPromise })

      return payload.find({
        collection: 'posts',
        depth: 1,
        limit: POSTS_PER_PAGE,
        locale,
        page,
        overrideAccess: false,
        select: {
          title: true,
          slug: true,
          categories: true,
          meta: true,
          shortDescription: true,
        },
      })
    },
    ['posts-list', locale, String(page)],
    [POSTS_LIST_TAG],
  )

/** Serves both `/posts` and `/posts/page/[pageNumber]`. */
export const createPostsRoute = (locale: Locale) => {
  async function PostsPage({ params: paramsPromise }: Args) {
    const { pageNumber = '1' } = await paramsPromise
    const t = getMessages(locale)

    const sanitizedPageNumber = Number(pageNumber)

    if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

    const posts = await getPostsPage(locale, sanitizedPageNumber)

    return (
      <div className="pt-24 pb-24">
        <HeaderTheme theme="light" />
        <div className="container mb-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{t.posts}</h1>
            </div>
            <div className="w-full max-w-md">
              <Search placeholder={t.searchPlaceholder} submitLabel={t.search} />
            </div>
          </div>
        </div>

        <div className="container mb-8">
          <PageRange
            collection="posts"
            currentPage={posts.page}
            limit={POSTS_PER_PAGE}
            totalDocs={posts.totalDocs}
          />
        </div>

        <CollectionArchive posts={posts.docs} />

        <div className="container">
          {posts.page && posts.totalPages > 1 && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    )
  }

  async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
    const { pageNumber } = await paramsPromise
    const t = getMessages(locale)
    return {
      title: pageNumber && pageNumber !== '1' ? `${t.posts} – ${pageNumber}` : t.posts,
    }
  }

  async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    const { totalDocs } = await payload.count({
      collection: 'posts',
      locale,
      overrideAccess: false,
    })

    const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

    return Array.from({ length: totalPages }, (_, i) => ({ pageNumber: String(i + 1) }))
  }

  return { generateMetadata, generateStaticParams, Page: PostsPage }
}
