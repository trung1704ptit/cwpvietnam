import type { VideoBlock as VideoBlockProps } from '@/payload-types'

import React from 'react'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

import { parseVideoUrl, type VideoEmbed } from './embed'

type Props = VideoBlockProps & { className?: string }

const getEmbed = ({ source, url, video }: VideoBlockProps): VideoEmbed | null => {
  if (source !== 'upload') return parseVideoUrl(url)
  if (!video || typeof video !== 'object' || !video.url) return null
  return { src: getMediaUrl(video.url, video.updatedAt), type: 'file' }
}

export const VideoBlock: React.FC<Props> = ({ className, ...props }) => {
  const embed = getEmbed(props)
  if (!embed) return null

  const { caption } = props

  return (
    <figure className={cn('not-prose my-8', className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {embed.type === 'iframe' ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embed.src}
            title={caption || 'Video'}
          />
        ) : (
          <video
            className="absolute inset-0 size-full"
            controls
            playsInline
            preload="metadata"
            src={embed.src}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}
