import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import {
  revalidateAllPagesAfterChange,
  revalidateAllPagesAfterDelete,
} from '@/hooks/revalidateAllPages'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { defaultLocale, isLocale } from '@/i18n/config'
import { localizePath } from '@/i18n/paths'
import { BACKUPS_PREFIX, BACKUPS_SLUG } from '@/backups/constants'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import {
  getR2PublicFileURL,
  isR2Enabled,
  r2Bucket,
  r2ClientConfig,
  r2PublicUrl,
} from '@/utilities/r2'

// The site title is appended by the frontend's title template.
const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => doc?.title || ''

const generateURL: GenerateURL<Post | Page> = ({ collectionConfig, doc, locale }) => {
  const url = getServerSideURL()
  const pathLocale = isLocale(locale) ? locale : defaultLocale
  const prefix = collectionConfig?.slug === 'posts' ? '/posts' : ''

  return `${url}${localizePath(doc?.slug ? `${prefix}/${doc.slug}` : '/', pathLocale)}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      hooks: {
        afterChange: [revalidateAllPagesAfterChange],
        afterDelete: [revalidateAllPagesAfterDelete],
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [...rootFeatures, FixedToolbarFeature()]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Cloudflare R2 via its S3-compatible API. `@payloadcms/storage-r2` only supports Workers bucket bindings.
  s3Storage({
    alwaysInsertFields: true,
    bucket: r2Bucket,
    // Vercel rejects request bodies over 4.5MB, so the admin PUTs media straight to R2 through a
    // presigned URL. Needs a CORS rule on the bucket allowing PUT from the site's origins.
    clientUploads: true,
    collections: {
      // Media is public, so browsers load it straight from R2's CDN instead of through a
      // serverless function.
      media: r2PublicUrl
        ? {
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) => getR2PublicFileURL(filename, prefix),
          }
        : true,
    },
    config: r2ClientConfig,
    enabled: isR2Enabled,
  }),
  // Separate instance without client uploads: backup files are renamed and parsed on the server
  // (`src/backups/hooks.ts`), and stay behind Payload's access control.
  s3Storage({
    alwaysInsertFields: true,
    bucket: r2Bucket,
    collections: {
      [BACKUPS_SLUG]: { prefix: BACKUPS_PREFIX },
    },
    config: r2ClientConfig,
    enabled: isR2Enabled,
  }),
]
