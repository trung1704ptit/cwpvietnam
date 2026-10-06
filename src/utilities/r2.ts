import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'

export const r2Bucket = process.env.R2_BUCKET || ''

export const isR2Enabled = Boolean(r2Bucket)

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
