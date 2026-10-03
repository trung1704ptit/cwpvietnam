import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import type { Locale } from '@/i18n/config'
import { localizePath } from '@/i18n/paths'
import { findByLocalizedSlug } from '@/utilities/findByLocalizedSlug'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { HeaderTheme } from './HeaderTheme'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryPostBySlug = cache(async ({ locale, slug }: { locale: Locale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  return findByLocalizedSlug<Post>({
    collection: 'posts',
    draft,
    locale,
    slug,
  })
})

export const createPostRoute = (locale: Locale) => {
  async function PostPage({ params: paramsPromise }: Args) {
    const { isEnabled: draft } = await draftMode()
    const { slug = '' } = await paramsPromise
    // Decode to support slugs with special characters
    const decodedSlug = decodeURIComponent(slug)
    const url = '/posts/' + decodedSlug
    const post = await queryPostBySlug({ locale, slug: decodedSlug })

    if (!post) return <PayloadRedirects locale={locale} url={url} />

    if (post.slug && post.slug !== decodedSlug) {
      redirect(localizePath(`/posts/${post.slug}`, locale))
    }

    return (
      <article className="pb-16">
        <HeaderTheme theme="dark" />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound locale={locale} url={url} />

        {draft && <LivePreviewListener />}

        <PostHero post={post} />

        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <RelatedPosts
                className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            )}
          </div>
        </div>
      </article>
    )
  }

  async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
    const { slug = '' } = await paramsPromise
    // Decode to support slugs with special characters
    const post = await queryPostBySlug({ locale, slug: decodeURIComponent(slug) })

    return generateMeta({ doc: post })
  }

  async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      locale,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return posts.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
  }

  return { generateMetadata, generateStaticParams, Page: PostPage }
}
