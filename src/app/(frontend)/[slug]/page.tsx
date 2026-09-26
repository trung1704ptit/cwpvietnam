import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { locales } from '@/i18n/config'
import { findByLocalizedSlug } from '@/utilities/findByLocalizedSlug'
import { getLocale } from '@/utilities/getLocale'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const slugs = new Set<string>()

  for (const locale of locales) {
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

    pages.docs?.forEach((doc) => {
      if (doc.slug && doc.slug !== 'home') slugs.add(doc.slug)
    })
  }

  return [...slugs].map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const locale = await getLocale()
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    locale,
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  if (page.slug && page.slug !== decodedSlug && decodedSlug !== 'home') {
    redirect(`/${page.slug}`)
  }

  const { hero, layout, title } = page

  return (
    <article className="pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} title={title} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const locale = await getLocale()
  const page = await queryPageBySlug({
    locale,
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(
  async ({ locale, slug }: { locale: Awaited<ReturnType<typeof getLocale>>; slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    return findByLocalizedSlug<RequiredDataFromCollectionSlug<'pages'>>({
      collection: 'pages',
      draft,
      locale,
      slug,
    })
  },
)
