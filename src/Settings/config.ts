import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import {
  DEFAULT_BASE_FONT_SIZE,
  DEFAULT_SITE_FONT,
  MAX_BASE_FONT_SIZE,
  MIN_BASE_FONT_SIZE,
  SITE_FONT_OPTIONS,
} from '@/utilities/siteFonts'
import { revalidateSettings } from './hooks/revalidateSettings'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'homePage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Home Page',
      admin: {
        description:
          'Page shown at "/". Its own URL redirects to "/". Only published pages are visible on the site.',
      },
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Primary Color',
      defaultValue: '#dd3e60',
      required: true,
      admin: {
        description: 'Brand primary color used for buttons, links, and accents.',
        placeholder: '#dd3e60',
      },
      validate: (value: string | null | undefined) => {
        if (typeof value !== 'string' || !HEX_COLOR.test(value)) {
          return 'Enter a valid hex color, e.g. #dd3e60'
        }

        return true
      },
    },
    {
      name: 'footerBackgroundColor',
      type: 'text',
      label: 'Footer Background Color',
      defaultValue: '#ffefec',
      required: true,
      admin: {
        description: 'Background color for the site footer.',
        placeholder: '#ffefec',
      },
      validate: (value: string | null | undefined) => {
        if (typeof value !== 'string' || !HEX_COLOR.test(value)) {
          return 'Enter a valid hex color, e.g. #ffefec'
        }

        return true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fontFamily',
          type: 'select',
          label: 'Font Family',
          defaultValue: DEFAULT_SITE_FONT,
          options: SITE_FONT_OPTIONS,
          required: true,
          admin: {
            description: 'Default font for the whole site.',
            width: '50%',
          },
        },
        {
          name: 'baseFontSize',
          type: 'number',
          label: 'Base Font Size (px)',
          defaultValue: DEFAULT_BASE_FONT_SIZE,
          max: MAX_BASE_FONT_SIZE,
          min: MIN_BASE_FONT_SIZE,
          required: true,
          admin: {
            description:
              'Default text size for the whole site. Headings and spacing scale with it.',
            step: 1,
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'siteTitle',
      type: 'text',
      label: 'Site Title',
      defaultValue: 'Cancer Wellness Program',
      required: true,
      admin: {
        description: 'Used in the logo alt text and browser metadata.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
