import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
          disableLocalized: true,
          disableRequired: true,
        }),
        {
          name: 'children',
          type: 'array',
          admin: {
            description: 'Optional submenu shown under this item.',
            initCollapsed: true,
            components: {
              RowLabel: '@/Header/RowLabel#RowLabel',
            },
          },
          fields: [
            link({
              appearances: false,
              disableLocalized: true,
            }),
          ],
          label: 'Nested menu',
          labels: {
            singular: 'Nested item',
            plural: 'Nested items',
          },
          maxRows: 8,
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
