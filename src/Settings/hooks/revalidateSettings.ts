import type { GlobalAfterChangeHook } from 'payload'

import { expireAllPages, expireTag } from '@/utilities/pageCache'

export const revalidateSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating settings`)

    // Theme, fonts and the home page selection affect every page.
    expireTag('global_settings')
    expireTag('pages-sitemap')
    expireAllPages()
  }

  return doc
}
