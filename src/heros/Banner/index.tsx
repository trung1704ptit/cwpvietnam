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
      className="relative flex min-h-[260px] items-center justify-center overflow-hidden text-white sm:min-h-[320px] md:h-[380px] md:max-h-[380px]"
      data-theme="dark"
    >
      <div className="absolute inset-0 select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            className="absolute inset-0 size-full"
            imgClassName="object-cover"
            priority
            resource={media}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
      <div className="container relative z-10 flex items-center justify-center py-12 md:py-0">
        <div className="w-full max-w-6xl text-center">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
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
            <ul className="flex flex-wrap justify-center gap-4">
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
