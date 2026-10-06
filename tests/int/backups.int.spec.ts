import { gzipSync } from 'zlib'
import { describe, expect, it } from 'vitest'

import { compareMigrations } from '@/backups/compatibility'
import { BACKUP_FORMAT, BACKUP_FORMAT_VERSION, isDumpedTable } from '@/backups/constants'
import { type BackupFile, decodeBackup, encodeBackup, summarizeBackup } from '@/backups/format'

const backup: BackupFile = {
  createdAt: '2026-10-06T08:00:00.000Z',
  database: { migrations: ['a', 'b'] },
  format: BACKUP_FORMAT,
  formatVersion: BACKUP_FORMAT_VERSION,
  tables: [
    { columns: ['id', 'filename'], data: '[{"id":1,"filename":"a.png"}]', name: 'media', rowCount: 1 },
    { columns: ['id', 'value'], data: '[{"id":1,"value":12345678901234567890.5}]', name: 'x', rowCount: 1 },
  ],
}

describe('backup compatibility', () => {
  it('accepts the same schema', () => {
    expect(compareMigrations(['a', 'b'], ['a', 'b'])).toEqual({ status: 'same' })
  })

  it('flags backups that predate migrations', () => {
    expect(compareMigrations(['a'], ['a', 'b', 'c'])).toEqual({
      missingInBackup: ['b', 'c'],
      status: 'older',
    })
  })

  it('rejects backups with migrations the database never ran', () => {
    expect(compareMigrations(['a', 'x'], ['a', 'b'])).toEqual({
      status: 'incompatible',
      unknownToDatabase: ['x'],
    })
  })
})

describe('backup file', () => {
  it('round-trips without touching row values', () => {
    const decoded = decodeBackup(encodeBackup(backup))
    expect(decoded).toEqual(backup)
    expect(decoded.tables[1].data).toContain('12345678901234567890.5')
  })

  it('summarizes the content', () => {
    expect(summarizeBackup(backup)).toEqual({
      createdAt: backup.createdAt,
      mediaCount: 1,
      migrations: ['a', 'b'],
      schemaVersion: 'b',
      tableCount: 2,
      totalRows: 2,
    })
  })

  it('rejects files that are not backups', () => {
    expect(() => decodeBackup(Buffer.from('plain'))).toThrow(/gzipped JSON/)
    expect(() => decodeBackup(gzipSync('{"format":"other"}'))).toThrow(/not a backup/)
    expect(() =>
      decodeBackup(encodeBackup({ ...backup, formatVersion: BACKUP_FORMAT_VERSION + 1 })),
    ).toThrow(/not supported/)
  })

  it('leaves backups, migrations, jobs and sessions out of the dump', () => {
    expect(isDumpedTable('posts')).toBe(true)
    expect(isDumpedTable('_posts_v_locales')).toBe(true)
    for (const table of [
      'backups',
      'backups_restore_history',
      'payload_migrations',
      'payload_jobs',
      'payload_locked_documents_rels',
      'users_sessions',
    ]) {
      expect(isDumpedTable(table)).toBe(false)
    }
  })
})
