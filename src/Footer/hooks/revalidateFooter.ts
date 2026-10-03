import type { GlobalAfterChangeHook } from 'payload'

import { expireTag } from '@/utilities/pageCache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    expireTag('global_footer')
  }

  return doc
}
