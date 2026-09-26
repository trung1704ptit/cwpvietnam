import type { Block, TextFieldSingleValidation } from 'payload'

import { link } from '@/fields/link'

export const Carousel: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlock',
  labels: {
    plural: 'Carousels',
    singular: 'Carousel',
  },
  fields: [
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      label: 'Autoplay',
    },
    {
      name: 'interval',
      type: 'number',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.autoplay),
        description: 'Seconds each slide is shown, unless the slide sets its own duration.',
        step: 1,
      },
      defaultValue: 5,
      label: 'Default slide duration (s)',
      max: 120,
      min: 2,
    },
    {
      name: 'slides',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
        },
        {
          name: 'duration',
          type: 'number',
          admin: {
            description:
              'Seconds this slide is shown before moving to the next one. Leave empty to use the carousel default (5s).',
            placeholder: 'Default',
            step: 1,
          },
          label: 'Duration (s)',
          max: 120,
          min: 2,
        },
        {
          name: 'backgroundType',
          type: 'select',
          defaultValue: 'image',
          label: 'Background type',
          options: [
            {
              label: 'Image',
              value: 'image',
            },
            {
              label: 'Video',
              value: 'video',
            },
          ],
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'image',
          },
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          label: 'Background image',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'video',
            description:
              'Upload an MP4/WebM to Media. Plays muted, looped, full width and cropped to fill the slider. Takes priority over Video URL.',
          },
          filterOptions: {
            mimeType: { contains: 'video' },
          },
          label: 'Background video',
          relationTo: 'media',
        },
        {
          name: 'videoURL',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundType === 'video',
            description:
              'Used when no video is uploaded: YouTube link (youtube.com/watch?v=…, youtu.be/…, shorts) or a direct MP4/WebM URL.',
          },
          label: 'Video URL',
          validate: ((value, { siblingData }) => {
            const { backgroundType, backgroundVideo } = (siblingData ?? {}) as {
              backgroundType?: string
              backgroundVideo?: unknown
            }
            if (backgroundType !== 'video') return true
            if (!value) return backgroundVideo ? true : 'Upload a video or enter a video URL.'
            try {
              const url = new URL(value)
              return ['http:', 'https:'].includes(url.protocol) || 'Use an http(s) URL.'
            } catch {
              return 'Enter a valid URL.'
            }
          }) satisfies TextFieldSingleValidation,
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          admin: {
            description: 'Dark overlay percentage. Use 0 for no overlay.',
            step: 5,
          },
          defaultValue: 40,
          label: 'Dark overlay (%)',
          max: 100,
          min: 0,
          required: true,
        },
        {
          name: 'buttons',
          type: 'array',
          fields: [
            link({
              appearances: ['default', 'outline'],
            }),
          ],
          label: 'Button',
          maxRows: 1,
        },
      ],
      labels: {
        plural: 'Slides',
        singular: 'Slide',
      },
      minRows: 1,
      required: true,
    },
  ],
}
