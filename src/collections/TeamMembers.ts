import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { authenticated } from '../access/authenticated'
import {
  revalidateAllPagesAfterChange,
  revalidateAllPagesAfterDelete,
} from '../hooks/revalidateAllPages'

const authenticatedOrActive: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    active: {
      equals: true,
    },
  }
}

const setNameFromFullName: CollectionBeforeChangeHook = ({ data }) => {
  if (data.fullName) {
    data.name = convertLexicalToPlaintext({ data: data.fullName }).replace(/\s+/g, ' ').trim()
  }

  return data
}

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    plural: 'Team Members',
    singular: 'Team Member',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrActive,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'position', 'active', 'updatedAt'],
    useAsTitle: 'name',
  },
  orderable: true,
  hooks: {
    afterChange: [revalidateAllPagesAfterChange],
    afterDelete: [revalidateAllPagesAfterDelete],
    beforeChange: [setNameFromFullName],
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      relationTo: 'media',
    },
    {
      name: 'fullName',
      type: 'richText',
      label: 'Full name',
      localized: true,
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      admin: {
        description: 'Inactive members are hidden on the site.',
        position: 'sidebar',
      },
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Generated from the full name.',
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: 'Display name',
      localized: true,
    },
  ],
}
