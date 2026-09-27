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
        { label: 'All active members', value: 'all' },
        { label: 'Selected members', value: 'selection' },
      ],
    },
    {
      name: 'members',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Shown in this order. Inactive members are skipped.',
      },
      hasMany: true,
      relationTo: 'team-members',
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Columns (desktop)',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
  ],
}
