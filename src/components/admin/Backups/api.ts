import { formatAdminURL } from 'payload/shared'

import type { BackupDownload } from '@/backups/endpoints'

import { createZip } from './zip'

export const backupsApiURL = (api: string, path: string) =>
  formatAdminURL({ apiRoute: api, path: `/backups${path}` })

/** Calls a backups endpoint and surfaces Payload's error message on failure. */
export const requestBackups = async <T>(
  api: string,
  path: string,
  init?: { body?: unknown; method?: 'GET' | 'POST' },
): Promise<T> => {
  const response = await fetch(backupsApiURL(api, path), {
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: 'include',
    headers: init?.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    method: init?.method ?? 'GET',
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (body as { errors?: { message?: string }[] } | null)?.errors?.[0]?.message ||
      `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return body as T
}

const saveFile = (href: string, filename: string) => {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const zipName = () =>
  `cwp-backups-${new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-')}.zip`

/**
 * Downloads the given backups: a single one as its `.json.gz` file, several as one ZIP built in
 * the browser. Returns how many backups were downloaded.
 */
export const downloadBackups = async (
  api: string,
  selection: { all: true } | { ids: (number | string)[] },
): Promise<number> => {
  const { files } = await requestBackups<{ files: BackupDownload[] }>(api, '/download', {
    body: selection,
    method: 'POST',
  })

  if (files.length === 0) throw new Error('No backups to download.')

  if (files.length === 1) {
    saveFile(files[0].url, files[0].filename)
    return 1
  }

  const entries = await Promise.all(
    files.map(async ({ filename, url, version }) => {
      const response = await fetch(url, { credentials: url.startsWith('/') ? 'include' : 'omit' })
      if (!response.ok) throw new Error(`Backup v${version} could not be downloaded.`)
      return { data: new Uint8Array(await response.arrayBuffer()), name: filename }
    }),
  )

  const href = URL.createObjectURL(createZip(entries))
  saveFile(href, zipName())
  setTimeout(() => URL.revokeObjectURL(href), 60_000)
  return files.length
}
