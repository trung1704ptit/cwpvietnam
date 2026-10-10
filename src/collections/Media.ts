import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  revalidateAllPagesAfterChange,
  revalidateAllPagesAfterDelete,
} from '../hooks/revalidateAllPages'
import {
  revalidatePostsListAfterChange,
  revalidatePostsListAfterDelete,
} from '../hooks/revalidatePostsList'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  hooks: {
    afterChange: [revalidatePostsListAfterChange, revalidateAllPagesAfterChange],
    afterDelete: [revalidatePostsListAfterDelete, revalidateAllPagesAfterDelete],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Frontend URLs carry `?updatedAt`, so a changed file gets a new URL and Vercel's CDN can
    // keep responses served through `/api/media/file/*` instead of running a function each time.
    modifyResponseHeaders: ({ headers }) => {
      headers.set(
        'Cache-Control',
        'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      )
      return headers
    },
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
  },
}
