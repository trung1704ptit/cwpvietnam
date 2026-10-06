import type { Payload } from 'payload'

import { compareMigrations, type SchemaCompatibility } from './compatibility'
import { isDumpedTable, isUntouchedTable, SESSIONS_TABLE } from './constants'
import {
  type DbClient,
  getAppliedMigrations,
  getTableColumns,
  quoteIdent,
  withTransaction,
} from './db'
import type { BackupFile } from './format'

export type RestoreResult = {
  compatibility: SchemaCompatibility
  rowsRestored: number
  sessionsKept: number
  /** Tables of the current schema that the backup has no data for. They are left empty. */
  tablesEmptied: string[]
  /** Tables in the backup that no longer exist. Their data is skipped. */
  tablesIgnored: string[]
  tablesRestored: number
}

export class RestoreError extends Error {}

export const assertRestorable = (compatibility: SchemaCompatibility, allowOlderSchema: boolean) => {
  if (compatibility.status === 'incompatible') {
    throw new RestoreError(
      `The backup was made on a schema this database doesn't have (${compatibility.unknownToDatabase.join(', ')}). Deploy that version and run its migrations first.`,
    )
  }
  if (compatibility.status === 'older' && !allowOlderSchema) {
    throw new RestoreError(
      'The backup was made on an older schema. Confirm restoring it into the current schema.',
    )
  }
}

type ForeignKey = { definition: string; name: string; table: string }

const tableType = (table: string) => `NULL::public.${quoteIdent(table)}`

/** Foreign keys on, or pointing at, any of the given tables. */
const getForeignKeys = async (client: DbClient, tables: string[]): Promise<ForeignKey[]> => {
  const { rows } = await client.query<ForeignKey>(
    `WITH targets AS (
       SELECT ('public.' || quote_ident(name))::regclass AS oid FROM unnest($1::text[]) AS name
     )
     SELECT c.conname AS name, c.conrelid::regclass::text AS "table",
            pg_get_constraintdef(c.oid) AS definition
       FROM pg_constraint c
      WHERE c.contype = 'f'
        AND (c.conrelid IN (SELECT oid FROM targets) OR c.confrelid IN (SELECT oid FROM targets))`,
    [tables],
  )
  return rows
}

const resetSequences = async (client: DbClient, tables: string[]) => {
  const { rows } = await client.query<{ column_name: string; sequence: string; table_name: string }>(
    `SELECT table_name, column_name, sequence
       FROM (
         SELECT c.table_name, c.column_name,
                pg_get_serial_sequence('public.' || quote_ident(c.table_name), c.column_name) AS sequence
           FROM information_schema.columns c
          WHERE c.table_schema = 'public' AND c.table_name = ANY($1::text[])
       ) s
      WHERE sequence IS NOT NULL`,
    [tables],
  )

  for (const { column_name, sequence, table_name } of rows) {
    await client.query(
      `SELECT setval($1, COALESCE((SELECT MAX(${quoteIdent(column_name)}) FROM ${quoteIdent(table_name)}), 0) + 1, false)`,
      [sequence],
    )
  }
}

/** Sessions of users that still exist with the same email after the restore. */
const captureSessions = async (client: DbClient, columnsByTable: Map<string, string[]>) => {
  if (!columnsByTable.has(SESSIONS_TABLE) || !columnsByTable.has('users')) return null

  const { rows } = await client.query<{ email: string; session: string; user_id: number }>(
    `SELECT row_to_json(s)::text AS session, u.id AS user_id, u.email
       FROM ${quoteIdent(SESSIONS_TABLE)} s
       JOIN users u ON u.id = s._parent_id`,
  )

  return async () => {
    const { rows: users } = await client.query<{ email: string; id: number }>(
      `SELECT id, email FROM users`,
    )
    const emailById = new Map(users.map(({ email, id }) => [id, email]))
    const kept = rows.filter(({ email, user_id }) => emailById.get(user_id) === email)

    if (kept.length > 0) {
      await client.query(
        `INSERT INTO ${quoteIdent(SESSIONS_TABLE)}
         SELECT * FROM json_populate_recordset(${tableType(SESSIONS_TABLE)}, $1::json)
         ON CONFLICT DO NOTHING`,
        [`[${kept.map(({ session }) => session).join(',')}]`],
      )
    }
    return kept.length
  }
}

/**
 * Replaces the content of the database with the backup, in a single transaction: if anything
 * fails, nothing changes. Backups, the migration log and job queues are not touched.
 */
export const restoreDatabase = (
  payload: Payload,
  backup: BackupFile,
  { allowOlderSchema = false } = {},
): Promise<RestoreResult> =>
  withTransaction(payload, 'BEGIN', async (client) => {
    await client.query(`SET LOCAL lock_timeout = '30s'`)

    const compatibility = compareMigrations(
      backup.database.migrations,
      await getAppliedMigrations(client),
    )
    assertRestorable(compatibility, allowOlderSchema)

    const columnsByTable = await getTableColumns(client, { insertableOnly: true })
    const targets = [...columnsByTable.keys()].filter((table) => !isUntouchedTable(table))
    const restoreSessions = await captureSessions(client, columnsByTable)
    const foreignKeys = await getForeignKeys(client, targets)

    // Rows reference each other in cycles (parents, self-references), so constraints are dropped
    // while the data is replaced and re-created afterwards, which re-validates every row.
    for (const { name, table } of foreignKeys) {
      await client.query(`ALTER TABLE ${table} DROP CONSTRAINT ${quoteIdent(name)}`)
    }

    await client.query(`TRUNCATE ${targets.map(quoteIdent).join(', ')}`)

    const backupTables = new Set(backup.tables.map(({ name }) => name))
    const tablesIgnored: string[] = []
    let rowsRestored = 0
    let tablesRestored = 0

    for (const table of backup.tables) {
      const currentColumns = columnsByTable.get(table.name)

      if (!currentColumns || !isDumpedTable(table.name)) {
        tablesIgnored.push(table.name)
        continue
      }

      const columns = table.columns.filter((column) => currentColumns.includes(column))
      tablesRestored++
      if (table.rowCount === 0 || columns.length === 0) continue

      const columnList = columns.map(quoteIdent).join(', ')
      const { rowCount } = await client.query(
        `INSERT INTO ${quoteIdent(table.name)} (${columnList}) OVERRIDING SYSTEM VALUE
         SELECT ${columnList} FROM json_populate_recordset(${tableType(table.name)}, $1::json)`,
        [table.data],
      )
      rowsRestored += rowCount ?? 0
    }

    const sessionsKept = (await restoreSessions?.()) ?? 0

    for (const { definition, name, table } of foreignKeys) {
      await client.query(`ALTER TABLE ${table} ADD CONSTRAINT ${quoteIdent(name)} ${definition}`)
    }

    await resetSequences(client, targets)

    return {
      compatibility,
      rowsRestored,
      sessionsKept,
      tablesEmptied: targets.filter((table) => isDumpedTable(table) && !backupTables.has(table)),
      tablesIgnored,
      tablesRestored,
    }
  })
