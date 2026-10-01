import type { Block, TextFieldSingleValidation } from 'payload'

import { link } from '@/fields/link'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const isIcon = (siblingData: unknown) =>
  (siblingData as { mediaType?: string } | undefined)?.mediaType === 'icon'

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
          name: 'mediaType',
          type: 'radio',
          admin: {
            layout: 'horizontal',
          },
          defaultValue: 'image',
          label: 'Visual',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Icon', value: 'icon' },
          ],
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            components: {
              Field: '@/fields/icon/IconPickerField#IconPickerField',
            },
            condition: (_, siblingData) => isIcon(siblingData),
          },
        },
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => isIcon(siblingData),
          },
          fields: [
            {
              name: 'iconColor',
              type: 'text',
              admin: {
                components: {
                  Field: '@/fields/color/ColorPickerField#ColorPickerField',
                },
                description: 'Leave empty to use the primary color.',
                placeholder: 'Primary color',
                width: '50%',
              },
              label: 'Icon color',
              validate: ((value) =>
                !value || HEX_COLOR.test(value)
                  ? true
                  : 'Use a hex color, e.g. #dd3e60') as TextFieldSingleValidation,
            },
            {
              name: 'iconSize',
              type: 'number',
              admin: {
                step: 4,
                width: '50%',
              },
              defaultValue: 48,
              label: 'Icon size (px)',
              max: 256,
              min: 12,
            },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          admin: {
            condition: (_, siblingData) => !isIcon(siblingData),
          },
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          label: 'Image',
          relationTo: 'media',
        },
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => !isIcon(siblingData) && Boolean(siblingData?.media),
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
