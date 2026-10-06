import type { PayloadRequest } from 'payload'

import type { Backup } from '@/payload-types'
import { expireAllPages, expireTag } from '@/utilities/pageCache'

import { compareMigrations, type SchemaCompatibility } from './compatibility'
import { BACKUP_MIME_TYPE, BACKUPS_SLUG, isDumpedTable, SITE_CACHE_TAGS } from './constants'
import { getAppliedMigrations, getTableColumns, withClient } from './db'
import { dumpDatabase } from './dump'
import { type BackupFile, type BackupSummary, decodeBackup, encodeBackup, summarizeBackup } from './format'
import { assertRestorable, restoreDatabase, type RestoreResult } from './restore'
import { checkBackupMedia, type MediaCheck, readBackupFile } from './storage'

export type BackupSource = NonNullable<Backup['source']>

export const createBackup = async (
  req: PayloadRequest,
  { note, source }: { note?: string | null; source: BackupSource },
): Promise<Backup> => {
  const data = encodeBackup(await dumpDatabase(req.payload))

  return req.payload.create({
    collection: BACKUPS_SLUG,
    context: { backupSource: source },
    data: { note: note || null },
    file: { data, mimetype: BACKUP_MIME_TYPE, name: 'backup.json.gz', size: data.length },
    req,
  })
}

const loadBackupFile = async (req: PayloadRequest, backup: Backup): Promise<BackupFile> =>
  decodeBackup(await readBackupFile(req.payload, backup))

export type BackupCheck = {
  compatibility: SchemaCompatibility
  currentSchemaVersion: string | null
  media: MediaCheck | { error: string }
  summary: BackupSummary
  /** Current tables the backup has no data for, emptied by a restore. */
  tablesEmptied: string[]
  /** Backup tables that no longer exist, skipped by a restore. */
  tablesIgnored: string[]
}

/** What restoring the backup would do, without changing anything. */
export const checkBackup = async (req: PayloadRequest, backup: Backup): Promise<BackupCheck> => {
  const file = await loadBackupFile(req, backup)

  const [migrations, columnsByTable] = await withClient(req.payload, async (client) => [
    await getAppliedMigrations(client),
    await getTableColumns(client),
  ] as const)

  const backupTables = new Set(file.tables.map(({ name }) => name))

  const media = await checkBackupMedia(req.payload, file).catch((error: unknown) => {
    req.payload.logger.error({ err: error, msg: 'Checking backup media failed' })
    return { error: error instanceof Error ? error.message : String(error) }
  })

  return {
    compatibility: compareMigrations(file.database.migrations, migrations),
    currentSchemaVersion: migrations.at(-1) ?? null,
    media,
    summary: summarizeBackup(file),
    tablesEmptied: [...columnsByTable.keys()].filter(
      (table) => isDumpedTable(table) && !backupTables.has(table),
    ),
    tablesIgnored: [...backupTables].filter((table) => !columnsByTable.has(table)),
  }
}

export type RestoreOutcome = RestoreResult & { safetyBackup: Pick<Backup, 'id' | 'version'> }

/**
 * Restores the backup after saving the current content as a new backup, so a restore can always
 * be undone by restoring that one.
 */
export const restoreBackup = async (
  req: PayloadRequest,
  backup: Backup,
  { allowOlderSchema = false } = {},
): Promise<RestoreOutcome> => {
  const file = await loadBackupFile(req, backup)

  // Fail before taking the safety backup when the restore can't run anyway.
  assertRestorable(
    compareMigrations(
      file.database.migrations,
      await withClient(req.payload, getAppliedMigrations),
    ),
    allowOlderSchema,
  )

  const safetyBackup = await createBackup(req, {
    note: `Automatic backup before restoring v${backup.version}`,
    source: 'pre-restore',
  })

  const result = await restoreDatabase(req.payload, file, { allowOlderSchema })

  req.payload.logger.info(
    `Restored backup v${backup.version}: ${result.rowsRestored} rows in ${result.tablesRestored} tables`,
  )

  expireAllPages()
  for (const tag of SITE_CACHE_TAGS) expireTag(tag)

  await req.payload.update({
    collection: BACKUPS_SLUG,
    context: {
      restoreHistory: [
        ...(backup.restoreHistory ?? []),
        {
          restoredAt: new Date().toISOString(),
          restoredBy: req.user?.email ?? null,
          safetyBackupVersion: safetyBackup.version,
        },
      ],
    },
    data: {},
    id: backup.id,
    req,
  })

  return { ...result, safetyBackup: { id: safetyBackup.id, version: safetyBackup.version } }
}
