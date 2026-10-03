import { ArrowRight, CalendarDays, ImageIcon, UserRound } from 'lucide-react'
import React from 'react'

import { LocalizedLink as Link } from '@/components/LocalizedLink'
import { Media } from '@/components/Media'
import type { Locale } from '@/i18n/config'
import type { Messages } from '@/i18n/messages'

import type { PostCardData } from './queries'

// Fixed time zone so the server-rendered date matches the hydrated one.
const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'Asia/Ho_Chi_Minh' }),
  vi: new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'Asia/Ho_Chi_Minh' }),
}

export const formatPostDate = (date: string, locale: Locale) =>
  dateFormatters[locale].format(new Date(date))

export const getPostHref = (slug: string) => `/posts/${slug}`

export const PostThumbnail: React.FC<{ className?: string; post: PostCardData; size: string }> = ({
  className,
  post,
  size,
}) => (
  <div className={className}>
    {post.image ? (
      <Media
        fill
        imgClassName="transition-transform duration-500 group-hover:scale-105"
        resource={post.image}
        size={size}
      />
    ) : (
      <div className="flex size-full items-center justify-center text-muted-foreground/50">
        <ImageIcon aria-hidden="true" className="size-8" />
      </div>
    )}
  </div>
)

export const PostCard: React.FC<{
  locale: Locale
  post: PostCardData
  showAuthor: boolean
  t: Messages
}> = ({ locale, post, showAuthor, t }) => {
  const href = getPostHref(post.slug)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:bg-card">
      <Link aria-hidden="true" className="relative block" href={href} tabIndex={-1}>
        <PostThumbnail
          className="relative aspect-[16/10] overflow-hidden bg-muted"
          post={post}
          size="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {post.categories.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {post.categories.map((category) => (
              <span
                className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm"
                key={category.id}
              >
                {category.title}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {(post.publishedAt || (showAuthor && post.authors.length > 0)) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
              </span>
            )}
            {showAuthor && post.authors.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound aria-hidden="true" className="size-3.5 text-primary" />
                {post.authors.join(', ')}
              </span>
            )}
          </div>
        )}

        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-foreground">
          <Link href={href}>{post.title}</Link>
        </h3>

        {post.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.description.replace(/\s/g, ' ')}
          </p>
        )}

        <Link
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-semibold text-primary"
          href={href}
        >
          {t.viewDetails}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  )
}
