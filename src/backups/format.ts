import { gunzipSync, gzipSync } from 'zlib'

import { BACKUP_FORMAT, BACKUP_FORMAT_VERSION } from './constants'

export type BackupTable = {
  columns: string[]
  /**
   * The rows as the JSON array Postgres produced. Kept as text so values are restored exactly,
   * without a round trip through JavaScript numbers.
   */
  data: string
  name: string
  rowCount: number
}

export type BackupFile = {
  createdAt: string
  database: {
    /** Applied Payload migrations, oldest first. Identifies the schema version of the data. */
    migrations: string[]
  }
  format: typeof BACKUP_FORMAT
  formatVersion: number
  tables: BackupTable[]
}

export type BackupSummary = {
  createdAt: string
  mediaCount: number
  migrations: string[]
  schemaVersion: string | null
  tableCount: number
  totalRows: number
}

export const encodeBackup = (backup: BackupFile): Buffer =>
  gzipSync(JSON.stringify(backup), { level: 9 })

export const decodeBackup = (buffer: Buffer): BackupFile => {
  let parsed: unknown

  try {
    parsed = JSON.parse(gunzipSync(buffer).toString('utf8'))
  } catch {
    throw new Error('The file is not a gzipped JSON backup.')
  }

  const backup = parsed as Partial<BackupFile> | null

  if (backup?.format !== BACKUP_FORMAT) {
    throw new Error('The file is not a backup created by this site.')
  }
  if (typeof backup.formatVersion !== 'number' || backup.formatVersion > BACKUP_FORMAT_VERSION) {
    throw new Error(
      `Backup format version ${backup.formatVersion} is not supported, update the site first.`,
    )
  }

  const tablesValid =
    Array.isArray(backup.tables) &&
    backup.tables.every(
      (table) =>
        typeof table?.name === 'string' &&
        Array.isArray(table.columns) &&
        typeof table.data === 'string',
    )

  if (!tablesValid || !Array.isArray(backup.database?.migrations)) {
    throw new Error('The backup file is incomplete or corrupted.')
  }

  return backup as BackupFile
}

export const summarizeBackup = (backup: BackupFile): BackupSummary => {
  const { migrations } = backup.database

  return {
    createdAt: backup.createdAt,
    mediaCount: backup.tables.find((table) => table.name === 'media')?.rowCount ?? 0,
    migrations,
    schemaVersion: migrations.at(-1) ?? null,
    tableCount: backup.tables.length,
    totalRows: backup.tables.reduce((sum, table) => sum + table.rowCount, 0),
  }
}
