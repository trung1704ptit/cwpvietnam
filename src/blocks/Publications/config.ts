import type { Block } from 'payload'

export const Publications: Block = {
  slug: 'publications',
  interfaceName: 'PublicationsBlock',
  labels: {
    plural: 'Publications',
    singular: 'Publications',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      label: 'Intro Content',
      localized: true,
    },
    {
      name: 'publications',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Publications',
        singular: 'Publication',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'The title links here, e.g. https://pubmed.ncbi.nlm.nih.gov/…',
          },
          label: 'Link',
          required: true,
        },
        {
          name: 'authors',
          type: 'richText',
          admin: {
            description: 'Shown in italics.',
          },
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
        },
      ],
    },
  ],
}
