import type { Block } from 'payload'

import { link } from '@/fields/link'

export const FeatureBlock: Block = {
  slug: 'featureBlock',
  interfaceName: 'FeatureBlock',
  labels: {
    plural: 'Feature Blocks',
    singular: 'Feature Block',
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          admin: {
            description: 'Items per row on desktop. Extra items wrap and stay centered.',
            width: '50%',
          },
          defaultValue: '4',
          options: ['2', '3', '4', '5', '6'].map((value) => ({ label: value, value })),
          required: true,
        },
        {
          name: 'align',
          type: 'select',
          admin: { width: '50%' },
          defaultValue: 'left',
          label: 'Content alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          label: 'Icon / image',
          relationTo: 'media',
        },
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.media),
          },
          fields: [
            {
              name: 'mediaSize',
              type: 'select',
              admin: { width: '34%' },
              defaultValue: 'custom',
              label: 'Icon / image size',
              options: [
                { label: 'Custom', value: 'custom' },
                { label: 'Full width', value: 'full' },
              ],
            },
            {
              name: 'mediaWidth',
              type: 'number',
              admin: {
                condition: (_, siblingData) => siblingData?.mediaSize !== 'full',
                step: 4,
                width: '33%',
              },
              defaultValue: 64,
              label: 'Width (px)',
              min: 8,
            },
            {
              name: 'mediaHeight',
              type: 'number',
              admin: {
                placeholder: 'Auto',
                step: 4,
                width: '33%',
              },
              label: 'Height (px)',
              min: 8,
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
      labels: {
        plural: 'Items',
        singular: 'Item',
      },
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
