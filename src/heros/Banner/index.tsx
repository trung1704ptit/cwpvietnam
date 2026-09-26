'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type BannerHeroProps = Page['hero'] & {
  title?: string | null
}

export const BannerHero: React.FC<BannerHeroProps> = ({ links, media, richText, title }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative flex h-[380px] max-h-[380px] items-center justify-center overflow-hidden text-white"
      data-theme="dark"
    >
      <div className="absolute inset-0 select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            className="h-full"
            pictureClassName="relative block h-full w-full"
            imgClassName="object-cover"
            priority
            resource={media}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="container relative z-10 flex items-center justify-center">
        <div className="w-full max-w-6xl text-center">
          {title && (
            <div className="mb-6">
              <h1 className="text-4xl font-medium leading-tight tracking-tight text-white md:text-6xl">
                {title}
              </h1>
              <div
                aria-hidden="true"
                className="mx-auto mt-5 h-1 w-28 rounded-full bg-primary md:w-36"
              />
            </div>
          )}
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
