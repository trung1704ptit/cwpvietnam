'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import type { CarouselBlock as CarouselBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type Slide = NonNullable<CarouselBlockProps['slides']>[number]

const getYouTubeId = (videoURL?: null | string): null | string => {
  if (!videoURL) return null

  try {
    const { hostname, pathname, searchParams } = new URL(videoURL)
    const host = hostname.replace(/^www\./, '')
    let id: null | string = null

    if (host === 'youtu.be') {
      id = pathname.split('/')[1] ?? null
    } else if (
      host === 'youtube.com' ||
      host.endsWith('.youtube.com') ||
      host === 'youtube-nocookie.com'
    ) {
      const [, type, pathId] = pathname.split('/')
      id =
        type === 'watch'
          ? searchParams.get('v')
          : ['embed', 'live', 'shorts', 'v'].includes(type)
            ? pathId
            : null
    }

    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

const SlideBackground: React.FC<{ priority: boolean; slide: Slide }> = ({ priority, slide }) => {
  if (slide.backgroundType === 'video') {
    const uploadedVideo =
      slide.backgroundVideo && typeof slide.backgroundVideo === 'object'
        ? slide.backgroundVideo
        : null
    const videoSrc = uploadedVideo
      ? getMediaUrl(uploadedVideo.url, uploadedVideo.updatedAt)
      : slide.videoURL
    const youTubeId = uploadedVideo ? null : getYouTubeId(slide.videoURL)

    if (youTubeId) {
      const params = new URLSearchParams({
        autoplay: '1',
        controls: '0',
        disablekb: '1',
        loop: '1',
        mute: '1',
        playlist: youTubeId,
        playsinline: '1',
        rel: '0',
      })

      return (
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube-nocookie.com/embed/${youTubeId}?${params}`}
          tabIndex={-1}
          title={slide.title}
        />
      )
    }

    if (!videoSrc) return null

    return (
      <video
        autoPlay
        className="absolute inset-0 size-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
        src={videoSrc}
      />
    )
  }

  if (!slide.backgroundImage || typeof slide.backgroundImage !== 'object') return null

  return (
    <Media
      fill
      className="size-full"
      imgClassName="object-cover"
      pictureClassName="relative block size-full"
      priority={priority}
      resource={slide.backgroundImage}
    />
  )
}

export const CarouselBlock: React.FC<CarouselBlockProps> = ({
  autoplay = true,
  interval = 5,
  slides,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = slides?.length ?? 0
  const activeDuration = slides?.[activeIndex]?.duration ?? interval ?? 5

  useEffect(() => {
    if (!autoplay || slideCount < 2) return

    const timer = window.setTimeout(
      () => setActiveIndex((current) => (current + 1) % slideCount),
      Math.max(2, activeDuration) * 1000,
    )

    return () => window.clearTimeout(timer)
  }, [activeDuration, activeIndex, autoplay, slideCount])

  if (!slides?.length) return null

  const activeSlide = slides[activeIndex] ?? slides[0]
  const overlayOpacity = Math.min(100, Math.max(0, activeSlide.overlayOpacity ?? 60)) / 100

  const goTo = (index: number) => setActiveIndex((index + slideCount) % slideCount)

  return (
    <section
      aria-label="Carousel"
      aria-roledescription="carousel"
      className="relative aspect-video w-full overflow-hidden bg-black text-white md:aspect-[23/9]"
    >
      <div className="absolute inset-0" key={activeSlide.id ?? activeIndex}>
        <SlideBackground priority={activeIndex === 0} slide={activeSlide} />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      <div className="container absolute inset-0 z-10 grid grid-rows-[1fr_auto_2fr] justify-items-center px-12 text-center sm:px-20">
        <div className="row-start-2 max-w-4xl">
          <h2 className="text-xl font-medium leading-tight tracking-tight sm:text-3xl md:text-5xl">
            {activeSlide.title}
          </h2>
          {activeSlide.text && (
            <p className="mx-auto mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-5 sm:line-clamp-none sm:text-base md:text-lg">
              {activeSlide.text}
            </p>
          )}
          {activeSlide.buttons?.[0]?.link && (
            <div className="mt-3 flex justify-center sm:mt-8">
              <CMSLink
                {...activeSlide.buttons[0].link}
                className="h-8 px-4 text-sm sm:h-11 sm:px-8 sm:text-base"
                size="lg"
              />
            </div>
          )}
        </div>
      </div>

      {slideCount > 1 && (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 transition hover:bg-black/55 sm:left-3 sm:size-10 md:left-6 md:size-12"
            onClick={() => goTo(activeIndex - 1)}
            type="button"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 transition hover:bg-black/55 sm:right-3 sm:size-10 md:right-6 md:size-12"
            onClick={() => goTo(activeIndex + 1)}
            type="button"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>

          <div
            aria-label="Choose slide"
            className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6"
            role="group"
          >
            {slides.map((slide, index) => (
              <button
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  'h-2 rounded-full transition-all sm:h-2.5',
                  index === activeIndex
                    ? 'w-6 bg-white sm:w-8'
                    : 'w-2 bg-white/55 hover:bg-white/80 sm:w-2.5',
                )}
                key={slide.id ?? index}
                onClick={() => goTo(index)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
