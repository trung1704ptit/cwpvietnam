import type { Block } from 'payload'

import { link } from '@/fields/link'

export const HomePartners: Block = {
  slug: 'homePartners',
  interfaceName: 'HomePartnersBlock',
  labels: {
    plural: 'Home Partners',
    singular: 'Home Partners',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Shown in two staggered columns. 4–5 images look best.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          relationTo: 'media',
          required: true,
        },
      ],
      labels: {
        plural: 'Images',
        singular: 'Image',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          admin: { width: '33%' },
          defaultValue: 'left',
          label: 'Images position',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          required: true,
        },
        {
          name: 'imageAspect',
          type: 'select',
          admin: { width: '33%' },
          defaultValue: 'landscape',
          label: 'Image shape',
          options: [
            { label: 'Landscape (4:3)', value: 'landscape' },
            { label: 'Wide (16:9)', value: 'wide' },
            { label: 'Square (1:1)', value: 'square' },
            { label: 'Portrait (3:4)', value: 'portrait' },
            { label: 'Auto (original ratio, full width)', value: 'auto' },
          ],
          required: true,
        },
        {
          name: 'gap',
          type: 'number',
          admin: { step: 4, width: '33%' },
          defaultValue: 16,
          label: 'Gap between images (px)',
          max: 64,
          min: 0,
        },
      ],
    },
    {
      name: 'title',
      type: 'richText',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Show "view more" button',
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.enableLink),
        },
      },
    }),
  ],
}
