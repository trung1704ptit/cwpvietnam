import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'

export const r2Bucket = process.env.R2_BUCKET || ''

export const isR2Enabled = Boolean(r2Bucket)

/**
 * Public origin of the bucket (custom domain or r2.dev), without trailing slash. The S3 API
 * endpoint (`*.r2.cloudflarestorage.com`) only accepts signed requests, so it is ignored here.
 */
const getR2PublicUrl = (): string | null => {
  const value = process.env.R2_PUBLIC_BASE_URL?.trim()
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.hostname.endsWith('.r2.cloudflarestorage.com')) return null
    return url.toString().replace(/\/+$/, '')
  } catch {
    return null
  }
}

export const r2PublicUrl = getR2PublicUrl()

/** Mirrors the object key built by `@payloadcms/storage-s3`: `<prefix>/<filename>`. */
export const getR2PublicFileURL = (filename: string, prefix?: string | null) => {
  const segments = [...(prefix ? prefix.split('/') : []), filename].filter(Boolean)
  return `${r2PublicUrl}/${segments.map(encodeURIComponent).join('/')}`
}

/** Cloudflare R2 through its S3-compatible API. */
export const r2ClientConfig: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || '',
    secretAccessKey: process.env.R2_SECRET_KEY || '',
  },
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  region: 'auto',
}

let client: S3Client | undefined

export const getR2Client = () => {
  client ??= new S3Client(r2ClientConfig)
  return client
}
