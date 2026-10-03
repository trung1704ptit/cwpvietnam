import type { FeatureBlock as FeatureBlockProps, Media as MediaType } from '@/payload-types'

import React from 'react'

import { DynamicIcon } from '@/components/DynamicIcon'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type FeatureItem = NonNullable<FeatureBlockProps['items']>[number]

const itemWidths: Record<FeatureBlockProps['columns'], string> = {
  '2': 'sm:w-[calc((100%_-_1.5rem)/2)]',
  '3': 'sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]',
  '4': 'sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_4.5rem)/4)]',
  '5': 'sm:w-[calc((100%_-_1.5rem)/2)] md:w-[calc((100%_-_3rem)/3)] xl:w-[calc((100%_-_6rem)/5)]',
  '6': 'sm:w-[calc((100%_-_1.5rem)/2)] md:w-[calc((100%_-_3rem)/3)] xl:w-[calc((100%_-_7.5rem)/6)]',
}

const FeatureMedia: React.FC<{
  align: FeatureBlockProps['align']
  item: FeatureItem
  media: MediaType
  sizes: string
}> = ({ align, item, media, sizes }) => {
  const { mediaHeight, mediaSize, mediaWidth } = item
  const aspect = media.width && media.height ? media.width / media.height : 1
  const isFull = mediaSize === 'full'
  const width = mediaWidth ?? 64

  const style: React.CSSProperties = isFull
    ? mediaHeight
      ? { height: mediaHeight }
      : { aspectRatio: aspect }
    : { height: mediaHeight ?? Math.round(width / aspect), maxWidth: '100%', width }

  return (
    <div
      className={cn(
        'relative mb-6 shrink-0 overflow-hidden',
        isFull ? 'w-full rounded-xl' : align === 'center' && 'mx-auto',
      )}
      style={style}
    >
      {media.mimeType === 'image/svg+xml' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={media.alt ?? ''}
          className="absolute inset-0 size-full object-contain"
          loading="lazy"
          src={getMediaUrl(media.url, media.updatedAt)}
        />
      ) : (
        <Media
          fill
          imgClassName={isFull ? 'object-cover' : 'object-contain'}
          resource={media}
          size={isFull ? sizes : `${width}px`}
        />
      )}
    </div>
  )
}

export const FeatureBlock: React.FC<FeatureBlockProps> = ({
  align,
  columns,
  enableLink,
  items,
  link,
  maxWidth,
  title,
}) => {
  const columnCount = columns ?? '4'
  const isCenter = align === 'center'
  const showLink = Boolean(enableLink && link)
  const mediaSizes = `(min-width: 1024px) ${Math.round(100 / Number(columnCount))}vw, (min-width: 640px) 50vw, 100vw`

  if (!items?.length && !title) return null

  return (
    <section className="container my-16 lg:my-24">
      <div className="mx-auto" style={maxWidth ? { maxWidth } : undefined}>
        {title && (
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center">
            <RichText
              className="text-3xl font-bold leading-tight tracking-tight md:text-4xl [&_p+p]:mt-2"
              data={title}
              enableGutter={false}
              enableProse={false}
            />
            <span aria-hidden="true" className="mt-5 h-1 w-14 rounded-full bg-primary" />
          </div>
        )}

        {items && items.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-6">
            {items.map((item, index) => {
              const isIcon = item.mediaType === 'icon'
              const media =
                !isIcon && item.media && typeof item.media === 'object' ? item.media : null

              return (
                <li className={cn('w-full', itemWidths[columnCount])} key={item.id ?? index}>
                  <article
                    className={cn(
                      'flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_10px_32px_-10px_rgb(0_0_0/0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-14px_rgb(0_0_0/0.4)] dark:bg-card',
                      isCenter ? 'items-center text-center' : 'items-start text-left',
                    )}
                  >
                    {isIcon && item.icon && (
                      <DynamicIcon
                        aria-hidden="true"
                        className={cn('mb-6 shrink-0', !item.iconColor && 'text-primary')}
                        color={item.iconColor || undefined}
                        size={item.iconSize ?? 48}
                        value={item.icon}
                      />
                    )}
                    {media && (
                      <FeatureMedia align={align} item={item} media={media} sizes={mediaSizes} />
                    )}
                    {item.title && (
                      <RichText
                        className="w-full text-xl font-bold leading-snug [&_p+p]:mt-1"
                        data={item.title}
                        enableGutter={false}
                        enableProse={false}
                      />
                    )}
                    {item.description && (
                      <RichText
                        className="mt-3 w-full text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-3 [&_ul]:list-inside [&_ul]:list-disc"
                        data={item.description}
                        enableGutter={false}
                        enableProse={false}
                      />
                    )}
                    {item.enableLink && item.link && (
                      <div className="mt-auto pt-6">
                        <CMSLink size="lg" {...item.link} />
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ul>
        )}

        {showLink && link && (
          <div className="mt-12 flex justify-center">
            <CMSLink size="xl" {...link} />
          </div>
        )}
      </div>
    </section>
  )
}
