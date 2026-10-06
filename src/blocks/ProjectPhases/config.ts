import type { Block, TextFieldSingleValidation } from 'payload'

import { DEFAULT_PHASES_BACKGROUND } from './constants'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const ProjectPhases: Block = {
  slug: 'projectPhases',
  interfaceName: 'ProjectPhasesBlock',
  labels: {
    plural: 'Project Phases',
    singular: 'Project Phases',
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
          name: 'backgroundColor',
          type: 'text',
          admin: {
            components: {
              Field: '@/fields/color/ColorPickerField#ColorPickerField',
            },
            width: '50%',
          },
          defaultValue: DEFAULT_PHASES_BACKGROUND,
          label: 'Background color',
          validate: ((value) =>
            !value || HEX_COLOR.test(value)
              ? true
              : 'Use a hex color, e.g. #fff5f7') as TextFieldSingleValidation,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          admin: {
            description: 'Leave empty to use the built-in world map.',
            width: '50%',
          },
          filterOptions: {
            mimeType: { contains: 'image' },
          },
          label: 'Background image',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'phases',
      type: 'array',
      admin: {
        description: 'Numbered in order. 3–4 phases fit best on one row.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            components: {
              Field: '@/fields/icon/IconPickerField#IconPickerField',
            },
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
        },
      ],
      labels: {
        plural: 'Phases',
        singular: 'Phase',
      },
      maxRows: 6,
    },
  ],
}
