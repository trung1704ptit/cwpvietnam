import { slugField as payloadSlugField } from 'payload'

import { slugify } from '@/utilities/slugify'

type SlugFieldArgs = NonNullable<Parameters<typeof payloadSlugField>[0]>

export const slugField = (args: SlugFieldArgs = {}) =>
  payloadSlugField({
    localized: true,
    ...args,
    slugify:
      args.slugify ??
      (({ valueToSlugify }) => slugify(typeof valueToSlugify === 'string' ? valueToSlugify : '')),
  })
