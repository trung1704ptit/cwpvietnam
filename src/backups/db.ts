import type { Payload } from 'payload'

/** The subset of a `pg` pool client used here (`pg` itself is not a direct dependency). */
export type DbClient = {
  query: <Row = Record<string, unknown>>(
    text: string,
    values?: unknown[],
  ) => Promise<{ rowCount: number | null; rows: Row[] }>
  release: () => void
}

type PostgresDb = { pool: { connect: () => Promise<DbClient> } }

export const quoteIdent = (name: string) => `"${name.replace(/"/g, '""')}"`

/** Runs `fn` on a dedicated connection, so a transaction spans all of its queries. */
export const withClient = async <T>(
  payload: Payload,
  fn: (client: DbClient) => Promise<T>,
): Promise<T> => {
  const client = await (payload.db as unknown as PostgresDb).pool.connect()

  try {
    return await fn(client)
  } finally {
    client.release()
  }
}

export const withTransaction = <T>(
  payload: Payload,
  begin: string,
  fn: (client: DbClient) => Promise<T>,
): Promise<T> =>
  withClient(payload, async (client) => {
    await client.query(begin)
    try {
      const result = await fn(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  })

/** Base tables of the public schema with their columns in definition order. */
export const getTableColumns = async (
  client: DbClient,
  { insertableOnly = false } = {},
): Promise<Map<string, string[]>> => {
  const { rows } = await client.query<{ column_name: string; table_name: string }>(
    `SELECT c.table_name, c.column_name
       FROM information_schema.columns c
       JOIN information_schema.tables t
         ON t.table_schema = c.table_schema AND t.table_name = c.table_name
      WHERE c.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        ${insertableOnly ? `AND c.is_generated = 'NEVER'` : ''}
      ORDER BY c.table_name, c.ordinal_position`,
  )

  const tables = new Map<string, string[]>()
  for (const { column_name, table_name } of rows) {
    tables.set(table_name, [...(tables.get(table_name) ?? []), column_name])
  }
  return tables
}

/** Names of the applied Payload migrations, oldest first. */
export const getAppliedMigrations = async (client: DbClient): Promise<string[]> => {
  const { rows } = await client.query<{ name: string }>(
    `SELECT name FROM payload_migrations WHERE name IS NOT NULL AND name <> 'dev' ORDER BY id`,
  )
  return rows.map(({ name }) => name)
}
