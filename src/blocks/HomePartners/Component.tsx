import type {
  HomePartnersBlock as HomePartnersBlockProps,
  Media as MediaType,
} from '@/payload-types'

import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type ImageItem = { id?: string | null; image: MediaType }

type FixedAspect = Exclude<HomePartnersBlockProps['imageAspect'], 'auto'>

const heightRatios: Record<FixedAspect, number> = {
  landscape: 3 / 4,
  portrait: 4 / 3,
  square: 1,
  wide: 9 / 16,
}

const getHeightRatio = (aspect: HomePartnersBlockProps['imageAspect'], image?: MediaType) => {
  if (aspect !== 'auto') return heightRatios[aspect] ?? heightRatios.landscape
  return image?.width && image.height ? image.height / image.width : heightRatios.landscape
}

const PartnerImage: React.FC<{ className?: string; image: MediaType; ratio: number }> = ({
  className,
  image,
  ratio,
}) => (
  <div
    className={cn(
      'group relative min-w-0 overflow-hidden rounded-2xl bg-muted shadow-[0_16px_40px_-16px_rgb(0_0_0/0.35)]',
      className,
    )}
    style={{ aspectRatio: `1 / ${ratio}` }}
  >
    <Media
      fill
      className="absolute inset-0 size-full"
      imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
      resource={image}
      size="(min-width: 1024px) 25vw, 50vw"
    />
  </div>
)

export const HomePartnersBlock: React.FC<HomePartnersBlockProps> = ({
  description,
  enableLink,
  gap,
  imageAspect,
  imagePosition,
  images,
  link,
  title,
}) => {
  const items: ImageItem[] = (images ?? []).flatMap(({ id, image }) =>
    image && typeof image === 'object' ? [{ id, image }] : [],
  )
  const showLink = Boolean(enableLink && link)

  if (!items.length && !title && !description && !showLink) return null

  const spacing = Math.max(0, gap ?? 16)
  const columns =
    items.length > 1
      ? [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)]
      : [items]
  const firstRatio = getHeightRatio(imageAspect, columns[0]?.[0]?.image)
  // Percentage padding resolves against the row width, so this equals half of the first image's height.
  const staggerOffset = `calc((100% - ${spacing}px) * ${firstRatio / 4} + ${spacing / 2}px)`

  return (
    <section className="container my-10 sm:my-16 lg:my-24">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        {items.length > 0 && (
          <div className={cn('min-w-0', imagePosition === 'right' && 'lg:order-last')}>
            <div
              className={cn(
                'grid gap-3 sm:gap-4 lg:hidden',
                items.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              )}
            >
              {items.map(({ id, image }, index) => (
                <PartnerImage
                  className="max-h-52 sm:max-h-72"
                  image={image}
                  key={id ?? index}
                  ratio={getHeightRatio(imageAspect, image)}
                />
              ))}
            </div>

            <div className="hidden lg:flex" style={{ gap: spacing }}>
              {columns.map((column, columnIndex) => (
                <div
                  className="flex min-w-0 flex-1 flex-col"
                  key={columnIndex}
                  style={{ gap: spacing, paddingTop: columnIndex === 1 ? staggerOffset : undefined }}
                >
                  {column.map(({ id, image }, index) => (
                    <PartnerImage
                      image={image}
                      key={id ?? index}
                      ratio={getHeightRatio(imageAspect, image)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-col items-start">
          <span aria-hidden="true" className="mb-6 h-1 w-14 rounded-full bg-primary" />
          {title && (
            <RichText
              className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl [&_p+p]:mt-2"
              data={title}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {description && (
            <RichText
              className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg [&_a]:text-primary [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-4 [&_ul]:list-inside [&_ul]:list-disc"
              data={description}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {showLink && link && <CMSLink className="mt-8" size="lg" {...link} />}
        </div>
      </div>
    </section>
  )
}
