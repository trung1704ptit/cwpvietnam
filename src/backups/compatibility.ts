export type SchemaCompatibility =
  /** The backup was taken on exactly the current schema. */
  | { status: 'same' }
  /**
   * The backup predates some migrations. Its rows are restored into the current tables; columns
   * and tables it doesn't know get their defaults or stay empty.
   */
  | { missingInBackup: string[]; status: 'older' }
  /** The backup contains migrations this database never ran (newer code or another branch). */
  | { status: 'incompatible'; unknownToDatabase: string[] }

export const compareMigrations = (
  backupMigrations: string[],
  databaseMigrations: string[],
): SchemaCompatibility => {
  const inDatabase = new Set(databaseMigrations)
  const inBackup = new Set(backupMigrations)

  const unknownToDatabase = backupMigrations.filter((name) => !inDatabase.has(name))
  if (unknownToDatabase.length > 0) return { status: 'incompatible', unknownToDatabase }

  const missingInBackup = databaseMigrations.filter((name) => !inBackup.has(name))
  if (missingInBackup.length > 0) return { missingInBackup, status: 'older' }

  return { status: 'same' }
}
