import { randomBytes } from 'crypto'
import fs from 'fs/promises'
import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
  type PayloadRequest,
} from 'payload'

import type { Backup } from '@/payload-types'

import { BACKUPS_SLUG } from './constants'
import { decodeBackup, summarizeBackup } from './format'
import type { BackupSource } from './service'

/** Fields derived from the backup file, never set by editors. */
const GENERATED_FIELDS = [
  'title',
  'version',
  'source',
  'schemaVersion',
  'migrations',
  'tableCount',
  'totalRows',
  'mediaCount',
  'backupCreatedAt',
  'createdBy',
  'restoreHistory',
] as const satisfies (keyof Backup)[]

const timestamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '')

/**
 * Backup files get an unguessable name, as the R2 bucket may be reachable from the internet.
 * Runs before Payload derives the stored filename from the upload.
 */
export const nameBackupFile: CollectionBeforeOperationHook<typeof BACKUPS_SLUG> = ({
  args,
  operation,
  req,
}) => {
  if (operation === 'create' && req.file) {
    req.file.name = `cwp-backup-${timestamp(new Date())}-${randomBytes(8).toString('hex')}.json.gz`
  }
  return args
}

const readUploadedFile = async (req: PayloadRequest): Promise<Buffer> => {
  const file = req.file
  if (!file) throw new APIError('Upload a backup file.', 400, undefined, true)
  if (file.data?.length) return file.data
  if (file.tempFilePath) return fs.readFile(file.tempFilePath)
  throw new APIError('The uploaded backup file is empty.', 400, undefined, true)
}

/** Local API `context` stays on the shared `req`, so values meant for one operation are consumed. */
const takeContext = <T>(req: PayloadRequest, key: string): T | undefined => {
  const value = req.context[key] as T | undefined
  delete req.context[key]
  return value
}

const nextVersion = async (req: PayloadRequest) => {
  const { docs } = await req.payload.find({
    collection: BACKUPS_SLUG,
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    select: { version: true },
    sort: '-version',
  })
  return (docs[0]?.version ?? 0) + 1
}

/**
 * Validates the uploaded file and records what it contains. Backups are immutable: only the note
 * can be edited, and the restore history is written by the restore endpoint.
 */
export const prepareBackup: CollectionBeforeChangeHook<Backup> = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation === 'update') {
    if (req.file) {
      throw new APIError(
        'A backup file cannot be replaced, create a new backup instead.',
        400,
        undefined,
        true,
      )
    }

    const generated = Object.fromEntries(
      GENERATED_FIELDS.map((field) => [field, originalDoc?.[field]]),
    )
    const restoreHistory = takeContext<Backup['restoreHistory']>(req, 'restoreHistory')

    return { ...data, ...generated, ...(restoreHistory ? { restoreHistory } : {}) }
  }

  const source = takeContext<BackupSource>(req, 'backupSource') ?? 'upload'

  let summary: ReturnType<typeof summarizeBackup>
  try {
    summary = summarizeBackup(decodeBackup(await readUploadedFile(req)))
  } catch (error) {
    if (error instanceof APIError) throw error
    throw new APIError(error instanceof Error ? error.message : String(error), 400, undefined, true)
  }

  const version = await nextVersion(req)

  return {
    ...data,
    backupCreatedAt: summary.createdAt,
    createdBy: req.user?.email ?? null,
    mediaCount: summary.mediaCount,
    migrations: summary.migrations,
    restoreHistory: [],
    schemaVersion: summary.schemaVersion,
    source,
    tableCount: summary.tableCount,
    title: `v${version}`,
    totalRows: summary.totalRows,
    version,
  }
}
