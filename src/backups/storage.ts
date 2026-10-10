import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs/promises'
import path from 'path'
import type { Payload } from 'payload'

import type { Backup } from '@/payload-types'
import { getR2Client, isR2Enabled, r2Bucket } from '@/utilities/r2'

import { BACKUPS_PREFIX, BACKUPS_SLUG } from './constants'
import type { BackupFile } from './format'

const getStaticDir = (payload: Payload, slug: string) => {
  const staticDir = payload.collections[slug as 'media']?.config.upload?.staticDir
  return staticDir ? path.resolve(staticDir) : null
}

/** Mirrors how `@payloadcms/storage-s3` builds object keys from upload metadata. */
const objectKey = (prefix: string | null | undefined, filename: string) =>
  path.posix.join(prefix || '', filename)

export const readBackupFile = async (payload: Payload, backup: Backup): Promise<Buffer> => {
  if (!backup.filename) throw new Error('This backup has no file.')

  if (isR2Enabled) {
    const object = await getR2Client().send(
      new GetObjectCommand({
        Bucket: r2Bucket,
        Key: objectKey(backup.prefix ?? BACKUPS_PREFIX, backup.filename),
      }),
    )
    if (!object.Body) throw new Error('The backup file is empty.')
    return Buffer.from(await object.Body.transformToByteArray())
  }

  const staticDir = getStaticDir(payload, BACKUPS_SLUG)
  if (!staticDir) throw new Error('Backups have no storage configured.')
  return fs.readFile(path.join(staticDir, path.basename(backup.filename)))
}

const stamp = (value: string) =>
  new Date(value).toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')

/** Readable download name, the stored filename is random on purpose. */
export const backupDownloadName = (backup: Backup) =>
  `cwp-backup-v${backup.version ?? backup.id}-${stamp(backup.backupCreatedAt ?? backup.createdAt)}.json.gz`

/**
 * A short-lived signed R2 link, so the browser downloads straight from R2 instead of through a
 * serverless function (Vercel caps response bodies at 4.5MB). `null` with local storage.
 */
export const getBackupDownloadURL = async (backup: Backup): Promise<null | string> => {
  if (!isR2Enabled) return null
  if (!backup.filename) throw new Error(`Backup v${backup.version} has no file.`)

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: r2Bucket,
      Key: objectKey(backup.prefix ?? BACKUPS_PREFIX, backup.filename),
      ResponseContentDisposition: `attachment; filename="${backupDownloadName(backup)}"`,
      ResponseContentType: 'application/gzip',
    }),
    { expiresIn: 300 },
  )
}

export type MediaCheck = {
  checked: number
  missing: { filename: string; id: number; key: string }[]
  storage: 'r2' | 'local'
}

const listR2Keys = async (): Promise<Set<string>> => {
  const keys = new Set<string>()
  let ContinuationToken: string | undefined

  do {
    const page = await getR2Client().send(
      new ListObjectsV2Command({ Bucket: r2Bucket, ContinuationToken }),
    )
    for (const { Key } of page.Contents ?? []) if (Key) keys.add(Key)
    ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (ContinuationToken)

  return keys
}

/**
 * Media files are not part of a backup, they stay in R2. Checks that every media document in the
 * backup still has its file, so restored pages don't show broken images.
 */
export const checkBackupMedia = async (
  payload: Payload,
  backup: BackupFile,
): Promise<MediaCheck> => {
  const table = backup.tables.find(({ name }) => name === 'media')
  const rows = table
    ? (JSON.parse(table.data) as { filename?: string | null; id: number; prefix?: string | null }[])
    : []
  const files = rows.flatMap(({ filename, id, prefix }) =>
    filename ? [{ filename, id, key: objectKey(prefix, filename) }] : [],
  )

  if (isR2Enabled) {
    const keys = await listR2Keys()
    return { checked: files.length, missing: files.filter(({ key }) => !keys.has(key)), storage: 'r2' }
  }

  const staticDir = getStaticDir(payload, 'media')
  const exists = await Promise.all(
    files.map(({ filename }) =>
      staticDir
        ? fs.access(path.join(staticDir, path.basename(filename))).then(
            () => true,
            () => false,
          )
        : false,
    ),
  )

  return {
    checked: files.length,
    missing: files.filter((_, i) => !exists[i]),
    storage: 'local',
  }
}
