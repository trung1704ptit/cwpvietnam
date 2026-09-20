'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const BannerHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
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
        <div className="max-w-[36.5rem] md:text-center">
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
