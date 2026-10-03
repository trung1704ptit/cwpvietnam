import type { PostsListBlock as PostsListBlockProps } from '@/payload-types'

import React from 'react'

import type { Locale } from '@/i18n/config'

import { PostsListClient } from './Component.client'
import { getPostCards, getPostsTaxonomy } from './queries'

const RECENT_POSTS_LIMIT = 4

export const PostsListBlock: React.FC<
  PostsListBlockProps & { id?: string; locale: Locale }
> = async ({ id, columns, locale, postsPerPage, showAuthor }) => {
  const limit = Math.min(Math.max(postsPerPage || 6, 1), 24)

  const [initialPosts, recentPosts, taxonomy] = await Promise.all([
    getPostCards({ limit, locale, page: 1 }),
    getPostCards({ limit: RECENT_POSTS_LIMIT, locale, page: 1 }),
    getPostsTaxonomy(locale),
  ])

  return (
    <section className="container my-16" id={`block-${id}`}>
      <PostsListClient
        columns={columns || '2'}
        initialPosts={initialPosts}
        limit={limit}
        locale={locale}
        recentPosts={recentPosts.docs}
        showAuthor={Boolean(showAuthor)}
        taxonomy={taxonomy}
      />
    </section>
  )
}
