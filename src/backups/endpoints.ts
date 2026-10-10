import { APIError, type Endpoint, type PayloadRequest } from 'payload'

import type { Backup } from '@/payload-types'

import { BACKUP_MIME_TYPE, BACKUPS_SLUG } from './constants'
import { RestoreError } from './restore'
import { checkBackup, createBackup, restoreBackup } from './service'
import { backupDownloadName, getBackupDownloadURL, readBackupFile } from './storage'

export type BackupDownload = { filename: string; id: number; url: string; version: number }

const MAX_DOWNLOADS = 100

const requireUser = (req: PayloadRequest) => {
  if (!req.user) throw new APIError('You must be logged in to manage backups.', 401, undefined, true)
}

const readJSON = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    const body = await req.json?.()
    return body && typeof body === 'object' ? body : {}
  } catch {
    return {}
  }
}

const findBackup = (req: PayloadRequest): Promise<Backup> =>
  req.payload.findByID({
    collection: BACKUPS_SLUG,
    depth: 0,
    id: String(req.routeParams?.id),
    overrideAccess: false,
    req,
  })

const toPublicError = (error: unknown) => {
  if (error instanceof APIError) return error
  if (error instanceof RestoreError) return new APIError(error.message, 409, undefined, true)
  const message = error instanceof Error ? error.message : String(error)
  return new APIError(message, 500, undefined, true)
}

export const backupEndpoints: Endpoint[] = [
  {
    method: 'post',
    path: '/create',
    handler: async (req) => {
      requireUser(req)
      const { note } = await readJSON(req)

      try {
        const doc = await createBackup(req, {
          note: typeof note === 'string' ? note.trim() : null,
          source: 'manual',
        })
        return Response.json({ doc })
      } catch (error) {
        req.payload.logger.error({ err: error, msg: 'Creating a backup failed' })
        throw toPublicError(error)
      }
    },
  },
  {
    method: 'post',
    path: '/download',
    handler: async (req) => {
      requireUser(req)
      const { all, ids } = await readJSON(req)
      const selectedIDs = Array.isArray(ids)
        ? ids.map(Number).filter((id) => Number.isInteger(id))
        : []

      if (all !== true && !selectedIDs.length) {
        throw new APIError('Select at least one backup to download.', 400, undefined, true)
      }

      const { docs } = await req.payload.find({
        collection: BACKUPS_SLUG,
        depth: 0,
        limit: MAX_DOWNLOADS,
        overrideAccess: false,
        req,
        sort: '-version',
        where: all === true ? {} : { id: { in: selectedIDs } },
      })

      const apiRoute = req.payload.config.routes.api
      const files: BackupDownload[] = await Promise.all(
        docs.map(async (backup) => ({
          filename: backupDownloadName(backup),
          id: backup.id,
          url:
            (await getBackupDownloadURL(backup)) ??
            `${apiRoute}/${BACKUPS_SLUG}/${backup.id}/download`,
          version: backup.version ?? backup.id,
        })),
      )

      return Response.json({ files })
    },
  },
  {
    method: 'get',
    path: '/:id/download',
    handler: async (req) => {
      requireUser(req)
      const backup = await findBackup(req)

      try {
        const file = await readBackupFile(req.payload, backup)
        return new Response(new Uint8Array(file), {
          headers: {
            'Content-Disposition': `attachment; filename="${backupDownloadName(backup)}"`,
            'Content-Length': String(file.length),
            'Content-Type': BACKUP_MIME_TYPE,
          },
        })
      } catch (error) {
        req.payload.logger.error({ err: error, msg: `Downloading backup ${backup.id} failed` })
        throw toPublicError(error)
      }
    },
  },
  {
    method: 'get',
    path: '/:id/check',
    handler: async (req) => {
      requireUser(req)
      const backup = await findBackup(req)

      try {
        return Response.json(await checkBackup(req, backup))
      } catch (error) {
        req.payload.logger.error({ err: error, msg: `Checking backup ${backup.id} failed` })
        throw toPublicError(error)
      }
    },
  },
  {
    method: 'post',
    path: '/:id/restore',
    handler: async (req) => {
      requireUser(req)
      const backup = await findBackup(req)
      const { allowOlderSchema } = await readJSON(req)

      try {
        const outcome = await restoreBackup(req, backup, {
          allowOlderSchema: allowOlderSchema === true,
        })
        return Response.json(outcome)
      } catch (error) {
        req.payload.logger.error({ err: error, msg: `Restoring backup ${backup.id} failed` })
        throw toPublicError(error)
      }
    },
  },
]
