import type { Block } from 'payload'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    plural: 'Teams',
    singular: 'Team',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      label: 'Intro Content',
      localized: true,
    },
    {
      name: 'populateBy',
      type: 'radio',
      defaultValue: 'all',
      label: 'Members to show',
      options: [
        { label: 'All members', value: 'all' },
        { label: 'Selected members', value: 'selection' },
      ],
    },
    {
      name: 'members',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Shown in this order.',
      },
      hasMany: true,
      relationTo: 'team-members',
    },
  ],
}
