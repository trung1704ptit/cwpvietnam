export const BACKUPS_SLUG = 'backups'

/** R2 key prefix for backup files, kept apart from media objects. */
export const BACKUPS_PREFIX = 'backups'

export const BACKUP_FORMAT = 'cwp-payload-backup'
export const BACKUP_FORMAT_VERSION = 1

export const BACKUP_MIME_TYPE = 'application/gzip'

/**
 * Tables that are neither dumped nor touched by a restore: the backups themselves (so restoring
 * never deletes backups), the migration log (it describes the live schema, not the content) and
 * runtime state such as queued jobs.
 */
export const isUntouchedTable = (table: string) =>
  table === BACKUPS_SLUG ||
  table.startsWith(`${BACKUPS_SLUG}_`) ||
  table === 'payload_migrations' ||
  table === 'payload_kv' ||
  table.startsWith('payload_jobs')

/** Transient state that is emptied on restore instead of being restored. */
export const RESET_TABLES = ['payload_locked_documents', 'payload_locked_documents_rels']

/**
 * Login sessions are not part of a backup. Current sessions survive a restore when their user
 * still exists with the same email, so whoever restores stays logged in.
 */
export const SESSIONS_TABLE = 'users_sessions'

export const isDumpedTable = (table: string) =>
  !isUntouchedTable(table) && !RESET_TABLES.includes(table) && table !== SESSIONS_TABLE

/** Cache tags of data that is shared by many pages, see `src/utilities/pageCache.ts`. */
export const SITE_CACHE_TAGS = [
  'posts-list',
  'posts-sitemap',
  'pages-sitemap',
  'redirects',
  'global_header',
  'global_footer',
  'global_settings',
]
