import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Page as PageType } from '@/payload-types'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { cache } from 'react'
import { defaultLocale, type Locale } from '@/i18n/config'
import { localizePath } from '@/i18n/paths'
import { findByLocalizedSlug } from '@/utilities/findByLocalizedSlug'
import { getHomePageId } from '@/utilities/getHomePageId'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { HeaderTheme } from './HeaderTheme'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

/** Without a slug, returns the page selected as Home Page in Settings. */
const queryPage = cache(
  async ({ locale, slug }: { locale: Locale; slug?: string }): Promise<PageType | null> => {
    const { isEnabled: draft } = await draftMode()

    if (slug) {
      return findByLocalizedSlug<PageType>({
        collection: 'pages',
        draft,
        locale,
        slug,
      })
    }

    const homePageId = await getHomePageId()
    if (!homePageId) return null

    const payload = await getPayload({ config: configPromise })

    return payload.findByID({
      collection: 'pages',
      disableErrors: true,
      draft,
      fallbackLocale: locale === defaultLocale ? false : defaultLocale,
      id: homePageId,
      locale,
      overrideAccess: draft,
    })
  },
)

const decodeSlug = (slug?: string) => (slug ? decodeURIComponent(slug) : undefined)

export const createPageRoute = (locale: Locale) => {
  async function Page({ params: paramsPromise }: Args) {
    const { isEnabled: draft } = await draftMode()
    const { slug } = await paramsPromise
    // Decode to support slugs with special characters
    const decodedSlug = decodeSlug(slug)
    const url = decodedSlug ? '/' + decodedSlug : '/'
    const homePageId = await getHomePageId()

    const page = await queryPage({ locale, slug: decodedSlug })

    if (!page) {
      return <PayloadRedirects locale={locale} url={url} />
    }

    if (decodedSlug) {
      if (homePageId && page.id === homePageId) {
        redirect(localizePath('/', locale))
      }

      if (page.slug && page.slug !== decodedSlug) {
        redirect(localizePath(`/${page.slug}`, locale))
      }
    }

    const { hero, layout, title } = page

    return (
      <article className="pb-24">
        <HeaderTheme theme="light" />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound locale={locale} url={url} />

        {draft && <LivePreviewListener />}

        <RenderHero {...hero} title={title} />
        <RenderBlocks blocks={layout} locale={locale} />
      </article>
    )
  }

  async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
    const { slug } = await paramsPromise
    const page = await queryPage({ locale, slug: decodeSlug(slug) })

    return generateMeta({ doc: page })
  }

  async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    const homePageId = await getHomePageId()

    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      locale,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return pages.docs.flatMap(({ id, slug }) => (slug && id !== homePageId ? [{ slug }] : []))
  }

  return { generateMetadata, generateStaticParams, Page }
}
