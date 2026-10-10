'use client'

import {
  Banner,
  Button,
  CheckboxInput,
  ConfirmationModal,
  toast,
  useConfig,
  useDocumentInfo,
  useFormFields,
  useModal,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { BackupCheck, RestoreOutcome } from '@/backups/service'

import { downloadBackups, requestBackups } from './api'
import './index.scss'

const MODAL_SLUG = 'confirm-backup-restore'
const MAX_LISTED = 10

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

const ListPreview: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="backup-restore__list">
    {items.slice(0, MAX_LISTED).map((item) => (
      <li key={item}>{item}</li>
    ))}
    {items.length > MAX_LISTED && <li>…and {items.length - MAX_LISTED} more</li>}
  </ul>
)

const SchemaStatus: React.FC<{ check: BackupCheck }> = ({ check }) => {
  const { compatibility, currentSchemaVersion, summary } = check

  if (compatibility.status === 'same') {
    return (
      <Banner type="success">
        Same schema as the current database (<code>{summary.schemaVersion ?? 'none'}</code>).
      </Banner>
    )
  }

  if (compatibility.status === 'older') {
    return (
      <Banner type="info">
        This backup is from an older schema (<code>{summary.schemaVersion ?? 'none'}</code>, current
        is <code>{currentSchemaVersion ?? 'none'}</code>). It predates{' '}
        {plural(compatibility.missingInBackup.length, 'migration')}:
        <ListPreview items={compatibility.missingInBackup} />
        Its data is restored into the current tables. Fields added since then get their default
        values, and content those migrations converted is restored as it was before.
      </Banner>
    )
  }

  return (
    <Banner type="error">
      This backup can&apos;t be restored here: it was taken on a schema this database doesn&apos;t
      have. Deploy the site version that includes these migrations and run them first:
      <ListPreview items={compatibility.unknownToDatabase} />
    </Banner>
  )
}

const MediaStatus: React.FC<{ media: BackupCheck['media'] }> = ({ media }) => {
  if ('error' in media) {
    return <Banner type="info">Media files could not be checked: {media.error}</Banner>
  }

  const where = media.storage === 'r2' ? 'R2' : 'the local media folder'

  if (media.checked === 0) return null

  if (media.missing.length === 0) {
    return (
      <Banner type="success">
        All {plural(media.checked, 'media file')} of this backup exist in {where}.
      </Banner>
    )
  }

  return (
    <Banner type="info">
      {media.missing.length} of {plural(media.checked, 'media file')} are missing from {where}.
      Their documents are restored, but the images will be broken until the files are re-uploaded:
      <ListPreview items={media.missing.map(({ id, key }) => `#${id} ${key}`)} />
    </Banner>
  )
}

export function RestorePanel() {
  const { id } = useDocumentInfo()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const { openModal } = useModal()
  const router = useRouter()

  const version = useFormFields(([fields]) => fields.version?.value as number | undefined)
  const [downloading, setDownloading] = useState(false)

  const [check, setCheck] = useState<BackupCheck | null>(null)
  const [checkError, setCheckError] = useState<string | null>(null)
  const [allowOlderSchema, setAllowOlderSchema] = useState(false)
  const [outcome, setOutcome] = useState<RestoreOutcome | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    requestBackups<BackupCheck>(api, `/${id}/check`).then(
      (result) => !cancelled && setCheck(result),
      (error: Error) => !cancelled && setCheckError(error.message),
    )

    return () => {
      cancelled = true
    }
  }, [api, id])

  if (!id) return null

  const status = check?.compatibility.status
  const canRestore =
    Boolean(check) && status !== 'incompatible' && (status !== 'older' || allowOlderSchema)

  const restore = async () => {
    try {
      const result = await requestBackups<RestoreOutcome>(api, `/${id}/restore`, {
        body: { allowOlderSchema },
        method: 'POST',
      })
      setOutcome(result)
      toast.success(`Backup v${version} restored.`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Restoring the backup failed.')
    }
  }

  const download = async () => {
    setDownloading(true)
    try {
      await downloadBackups(api, { ids: [id] })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Downloading the backup failed.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="backup-restore">
      <h3 className="backup-restore__heading">Restore this version</h3>

      {!check && !checkError && <p>Checking the backup against the current database…</p>}
      {checkError && <Banner type="error">The backup could not be read: {checkError}</Banner>}

      {check && (
        <div className="backup-restore__checks">
          <p>
            {plural(check.summary.totalRows, 'row')} in {plural(check.summary.tableCount, 'table')},
            taken {new Date(check.summary.createdAt).toLocaleString()}.
          </p>
          <SchemaStatus check={check} />
          <MediaStatus media={check.media} />
          {check.tablesEmptied.length > 0 && (
            <Banner type="info">
              The backup has no data for {plural(check.tablesEmptied.length, 'table')}, they will be
              empty after the restore:
              <ListPreview items={check.tablesEmptied} />
            </Banner>
          )}
          {status === 'older' && (
            <CheckboxInput
              checked={allowOlderSchema}
              label="I understand, restore this older backup into the current schema"
              onToggle={(event) => setAllowOlderSchema(event.target.checked)}
            />
          )}
        </div>
      )}

      {outcome && (
        <Banner type="success">
          Restored {plural(outcome.rowsRestored, 'row')} in{' '}
          {plural(outcome.tablesRestored, 'table')}. The content from before the restore was saved
          as backup v{outcome.safetyBackup.version}.
          {outcome.sessionsKept === 0 && ' Your login was not part of the restored data, log in again.'}
        </Banner>
      )}

      <div className="backup-restore__actions">
        <Button
          buttonStyle="secondary"
          disabled={downloading}
          onClick={() => void download()}
          size="medium"
        >
          {downloading ? 'Downloading…' : `Download v${version ?? ''}`.trim()}
        </Button>
        <Button
          buttonStyle="primary"
          disabled={!canRestore}
          onClick={() => openModal(MODAL_SLUG)}
          size="medium"
        >
          Restore v{version}
        </Button>
      </div>

      <ConfirmationModal
        body={
          <p>
            Every page, post, setting and user is replaced with the content of backup v{version}.
            The current content is saved as a new backup first, so you can undo this by restoring
            that backup. Media files in R2 are not changed.
          </p>
        }
        confirmingLabel="Restoring…"
        confirmLabel="Restore"
        heading={`Restore backup v${version}?`}
        modalSlug={MODAL_SLUG}
        onConfirm={restore}
      />
    </div>
  )
}
