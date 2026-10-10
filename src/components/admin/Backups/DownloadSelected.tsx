'use client'

import { Button, toast, useConfig, useSelection } from '@payloadcms/ui'
import React, { useState } from 'react'

import { downloadBackups } from './api'

/** `SelectAllStatus.AllAvailable`: "select all" across pages, which has no ID list. */
const ALL_AVAILABLE = 'allAvailable'

/** Downloads the backups ticked in the list: one as its file, several as a ZIP. */
export function DownloadSelected() {
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const { count, getSelectedIds, selectAll } = useSelection()
  const [downloading, setDownloading] = useState(false)

  const download = async () => {
    setDownloading(true)
    try {
      const downloaded = await downloadBackups(
        api,
        String(selectAll) === ALL_AVAILABLE ? { all: true } : { ids: getSelectedIds() },
      )
      toast.success(
        downloaded === 1 ? 'Backup downloaded.' : `${downloaded} backups downloaded as a ZIP.`,
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Downloading the backups failed.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      buttonStyle="secondary"
      disabled={downloading || count === 0}
      onClick={() => void download()}
      size="medium"
      tooltip={count === 0 ? 'Tick the backups to download in the list below' : undefined}
    >
      {downloading
        ? 'Downloading…'
        : count > 0
          ? `Download selected (${count})`
          : 'Download selected'}
    </Button>
  )
}
