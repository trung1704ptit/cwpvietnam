'use client'

import { Button, toast, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import type { Backup } from '@/payload-types'

import { requestBackups } from './api'
import './index.scss'

export function CreateBackup() {
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const router = useRouter()
  const [note, setNote] = useState('')
  const [creating, setCreating] = useState(false)

  const create = async () => {
    setCreating(true)
    try {
      const { doc } = await requestBackups<{ doc: Backup }>(api, '/create', {
        body: { note },
        method: 'POST',
      })
      toast.success(`Backup v${doc.version} created.`)
      setNote('')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Creating the backup failed.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="backups-create">
      <input
        className="backups-create__note"
        disabled={creating}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Note (optional), e.g. Before redesigning the home page"
        type="text"
        value={note}
      />
      <Button buttonStyle="primary" disabled={creating} onClick={() => void create()} size="medium">
        {creating ? 'Creating backup…' : 'Create backup'}
      </Button>
    </div>
  )
}
