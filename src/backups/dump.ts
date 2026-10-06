import type { Payload } from 'payload'

import { BACKUP_FORMAT, BACKUP_FORMAT_VERSION, isDumpedTable } from './constants'
import { getAppliedMigrations, getTableColumns, quoteIdent, withTransaction } from './db'
import type { BackupFile } from './format'

/** Dumps every content table from one consistent snapshot of the database. */
export const dumpDatabase = (payload: Payload): Promise<BackupFile> =>
  withTransaction(
    payload,
    'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY',
    async (client) => {
      const columnsByTable = await getTableColumns(client)
      const migrations = await getAppliedMigrations(client)
      const tables: BackupFile['tables'] = []

      for (const [name, columns] of columnsByTable) {
        if (!isDumpedTable(name)) continue

        const { rows } = await client.query<{ data: string; row_count: number }>(
          `SELECT COALESCE(json_agg(t)::text, '[]') AS data, count(*)::int AS row_count
             FROM ${quoteIdent(name)} t`,
        )

        tables.push({ columns, data: rows[0].data, name, rowCount: rows[0].row_count })
      }

      return {
        createdAt: new Date().toISOString(),
        database: { migrations },
        format: BACKUP_FORMAT,
        formatVersion: BACKUP_FORMAT_VERSION,
        tables,
      }
    },
  )
