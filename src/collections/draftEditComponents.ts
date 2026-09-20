import type { CollectionAdminOptions } from 'payload'

export const draftEditComponents: NonNullable<CollectionAdminOptions['components']> = {
  edit: {
    SaveDraftButton: '@/components/admin/SaveChangesButton#SaveChangesButton',
  },
}
