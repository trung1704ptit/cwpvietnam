import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

/** Admin logins last 24 hours; `SessionKeepAlive` renews them while an editor keeps working. */
const SESSION_DURATION_SECONDS = 60 * 60 * 24

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: SESSION_DURATION_SECONDS,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
