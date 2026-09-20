import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
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
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
