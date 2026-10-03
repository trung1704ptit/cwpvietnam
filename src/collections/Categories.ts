import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import {
  revalidateAllPagesAfterChange,
  revalidateAllPagesAfterDelete,
} from '@/hooks/revalidateAllPages'
import {
  revalidatePostsListAfterChange,
  revalidatePostsListAfterDelete,
} from '@/hooks/revalidatePostsList'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidatePostsListAfterChange, revalidateAllPagesAfterChange],
    afterDelete: [revalidatePostsListAfterDelete, revalidateAllPagesAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
