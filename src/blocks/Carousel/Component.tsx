'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useId, useState } from 'react'

import type { CarouselBlock as CarouselBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
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
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-full min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2"
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
      className="absolute inset-0 size-full"
      imgClassName="object-cover"
      priority={priority}
      resource={slide.backgroundImage}
    />
  )
}

const mobileHeights: Record<NonNullable<CarouselBlockProps['mobileHeight']>, string> = {
  '100vh': '100dvh',
  '480': '480px',
  '640': '640px',
  '70vh': '70dvh',
  '85vh': '85dvh',
  aspect: 'auto',
}

export const CarouselBlock: React.FC<CarouselBlockProps> = ({
  autoplay = true,
  id,
  interval = 5,
  mobileHeight = '70vh',
  slides,
}) => {
  const reactId = useId().replace(/:/g, '')
  const carouselId = (id || reactId).replace(/[^a-zA-Z0-9_-]/g, '')
  const mobileHeightValue = mobileHeights[mobileHeight ?? '70vh'] ?? mobileHeights['70vh']
  // `step` counts transitions; background layers are keyed by it so the outgoing slide keeps its
  // DOM node (and video playback) while the incoming one mounts fresh and runs its enter animation.
  const [{ activeIndex, previousIndex, step }, setState] = useState({
    activeIndex: 0,
    previousIndex: null as null | number,
    step: 0,
  })
  const slideCount = slides?.length ?? 0
  const activeDuration = Math.max(2, slides?.[activeIndex]?.duration ?? interval ?? 5)
  const shouldAutoplay = Boolean(autoplay) && slideCount > 1

  const goTo = (index: number) =>
    setState((current) => {
      const nextIndex = (index + slideCount) % slideCount
      if (nextIndex === current.activeIndex) return current
      return { activeIndex: nextIndex, previousIndex: current.activeIndex, step: current.step + 1 }
    })

  useEffect(() => {
    if (!shouldAutoplay) return

    const timer = window.setTimeout(
      () =>
        setState((current) => ({
          activeIndex: (current.activeIndex + 1) % slideCount,
          previousIndex: current.activeIndex,
          step: current.step + 1,
        })),
      activeDuration * 1000,
    )

    return () => window.clearTimeout(timer)
  }, [activeDuration, shouldAutoplay, slideCount, step])

  if (!slides?.length) return null

  const activeSlide = slides[activeIndex] ?? slides[0]
  const overlayOpacity = Math.min(100, Math.max(0, activeSlide.overlayOpacity ?? 60)) / 100
  const nextIndex = (activeIndex + 1) % slideCount
  const nextSlide = slides[nextIndex]
  const preloadNext =
    slideCount > 1 && nextIndex !== previousIndex && nextSlide?.backgroundType !== 'video'

  const backgroundLayers = [
    ...(previousIndex !== null && slides[previousIndex]
      ? [{ index: previousIndex, key: step - 1, slide: slides[previousIndex] }]
      : []),
    { index: activeIndex, key: step, slide: activeSlide },
  ]
  const textAnimation = step > 0 ? 'animate-carousel-text-in motion-reduce:animate-none' : ''

  const mobileHeightCss =
    mobileHeightValue === 'auto'
      ? `@media (width < 96rem){[data-carousel="${carouselId}"]{aspect-ratio:16/9}}`
      : `@media (width < 96rem){[data-carousel="${carouselId}"]{height:${mobileHeightValue}}}`

  return (
    <section
      aria-label="Carousel"
      aria-roledescription="carousel"
      className="relative w-full overflow-hidden bg-black text-white md:aspect-[23/9]"
      data-carousel={carouselId}
    >
      <style dangerouslySetInnerHTML={{ __html: mobileHeightCss }} />
      <div aria-hidden="true" className="absolute inset-0 isolate overflow-hidden">
        {backgroundLayers.map(({ index, key, slide }) => (
          <div
            className={cn(
              'absolute inset-0 will-change-[opacity,transform]',
              key === step ? 'z-[2]' : 'z-[1]',
              key > 0 && 'animate-carousel-slide-in motion-reduce:animate-none',
            )}
            key={key}
          >
            <SlideBackground priority={index === 0 && key === 0} slide={slide} />
          </div>
        ))}
        {preloadNext && nextSlide && (
          <div className="absolute inset-0 z-0 opacity-0" key={`preload-${nextIndex}`}>
            <SlideBackground priority={false} slide={nextSlide} />
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out"
        style={{ opacity: overlayOpacity }}
      />

      <div className="container absolute inset-0 z-10 grid grid-rows-[1fr_auto_2fr] justify-items-center px-12 text-center sm:px-20">
        <div aria-live="polite" className="row-start-2 max-w-5xl mt-6" key={step}>
          <h2
            className={cn(
              'text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-6xl mb-6',
              textAnimation,
              '[animation-delay:250ms]',
            )}
          >
            {activeSlide.title}
          </h2>
          {activeSlide.text && (
            <RichText
              className={cn(
                'mx-auto mt-6 max-w-5xl text-lg lg:text-2xl [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-2 [&_ul]:list-inside [&_ul]:list-disc',
                textAnimation,
                '[animation-delay:400ms]',
              )}
              data={activeSlide.text}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {activeSlide.buttons?.[0]?.link && (
            <div
              className={cn(
                'mt-3 flex justify-center sm:mt-8',
                textAnimation,
                '[animation-delay:550ms]',
              )}
            >
              <CMSLink {...activeSlide.buttons[0].link} />
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
                  'relative h-2 overflow-hidden rounded-full transition-all duration-500 ease-out sm:h-2.5',
                  index === activeIndex
                    ? 'w-6 bg-white/40 sm:w-8'
                    : 'w-2 bg-white/55 hover:bg-white/80 sm:w-2.5',
                )}
                key={slide.id ?? index}
                onClick={() => goTo(index)}
                type="button"
              >
                {index === activeIndex && (
                  <span
                    className={cn(
                      'absolute inset-0 origin-left rounded-full bg-white',
                      shouldAutoplay && 'animate-carousel-progress motion-reduce:animate-none',
                    )}
                    key={step}
                    style={shouldAutoplay ? { animationDuration: `${activeDuration}s` } : undefined}
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
