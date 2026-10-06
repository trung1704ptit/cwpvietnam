import { formatAdminURL } from 'payload/shared'

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
