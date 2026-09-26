import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div
      className="relative flex h-[380px] max-h-[380px] items-center justify-center overflow-hidden text-white"
      data-theme="dark"
    >
      <div className="absolute inset-0 select-none">
        {heroImage && typeof heroImage === 'object' && (
          <Media
            fill
            className="h-full"
            pictureClassName="relative block h-full w-full"
            imgClassName="object-cover"
            priority
            resource={heroImage}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="container relative z-10 flex justify-center">
        <div className="w-full max-w-4xl text-center">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <h1 className="mb-6 text-3xl font-medium md:text-5xl">{title}</h1>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
