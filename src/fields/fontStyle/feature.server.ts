import { createServerFeature } from '@payloadcms/richtext-lexical'

export const FontStyleFeature = createServerFeature({
  feature: {
    ClientFeature: '@/fields/fontStyle/feature.client#FontStyleFeatureClient',
  },
  key: 'fontStyle',
})
