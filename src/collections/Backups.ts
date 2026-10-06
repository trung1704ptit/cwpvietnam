import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { authenticated } from '../access/authenticated'
import { BACKUP_MIME_TYPE, BACKUPS_SLUG } from '../backups/constants'
import { backupEndpoints } from '../backups/endpoints'
import { nameBackupFile, prepareBackup } from '../backups/hooks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const readOnly = { readOnly: true }

export const Backups: CollectionConfig<'backups'> = {
  slug: BACKUPS_SLUG,
  labels: {
    plural: 'Backups',
    singular: 'Backup',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    components: {
      beforeListTable: ['@/components/admin/Backups/CreateBackup#CreateBackup'],
    },
    defaultColumns: ['title', 'note', 'source', 'schemaVersion', 'totalRows', 'createdAt'],
    description:
      'Snapshots of every database table. Media files stay in R2 and are not part of a backup.',
    useAsTitle: 'title',
  },
  defaultSort: '-version',
  disableDuplicate: true,
  endpoints: backupEndpoints,
  hooks: {
    beforeChange: [prepareBackup],
    beforeOperation: [nameBackupFile],
  },
  upload: {
    crop: false,
    focalPoint: false,
    hideRemoveFile: true,
    mimeTypes: [BACKUP_MIME_TYPE, 'application/x-gzip'],
    // Only used when R2 is not configured. Outside `public/` so files are served with access control.
    staticDir: path.resolve(dirname, '../../backups'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { ...readOnly, position: 'sidebar' },
    },
    {
      name: 'restore',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/Backups/RestorePanel#RestorePanel',
        },
      },
    },
    {
      name: 'note',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'version',
          type: 'number',
          admin: { ...readOnly, width: '25%' },
          index: true,
          unique: true,
        },
        {
          name: 'source',
          type: 'select',
          admin: { ...readOnly, width: '25%' },
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Before restore', value: 'pre-restore' },
            { label: 'Uploaded file', value: 'upload' },
          ],
        },
        {
          name: 'createdBy',
          type: 'text',
          admin: { ...readOnly, width: '50%' },
        },
      ],
    },
    {
      name: 'schemaVersion',
      type: 'text',
      admin: {
        ...readOnly,
        description: 'Latest database migration applied when the backup was taken.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'tableCount', type: 'number', admin: { ...readOnly, width: '25%' } },
        { name: 'totalRows', type: 'number', admin: { ...readOnly, width: '25%' } },
        { name: 'mediaCount', type: 'number', admin: { ...readOnly, width: '25%' } },
        {
          name: 'backupCreatedAt',
          type: 'date',
          admin: {
            ...readOnly,
            date: { pickerAppearance: 'dayAndTime' },
            width: '25%',
          },
        },
      ],
    },
    {
      name: 'migrations',
      type: 'json',
      admin: { hidden: true },
    },
    {
      name: 'restoreHistory',
      type: 'array',
      admin: {
        ...readOnly,
        condition: (data) => Boolean(data?.restoreHistory?.length),
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'restoredAt',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' }, width: '40%' },
            },
            { name: 'restoredBy', type: 'text', admin: { width: '40%' } },
            {
              name: 'safetyBackupVersion',
              type: 'number',
              admin: { description: 'Backup taken right before this restore.', width: '20%' },
            },
          ],
        },
      ],
    },
  ],
}
