import type { Block, TextFieldSingleValidation, UploadFieldSingleValidation } from 'payload'

import { parseVideoUrl } from './embed'

type SiblingData = { source?: 'embed' | 'upload' }

const isUpload = (siblingData: unknown) => (siblingData as SiblingData)?.source === 'upload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  labels: {
    plural: 'Videos',
    singular: 'Video',
  },
  fields: [
    {
      name: 'source',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'embed',
      options: [
        { label: 'Embed URL', value: 'embed' },
        { label: 'Upload', value: 'upload' },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => !isUpload(siblingData),
        description: 'YouTube, Vimeo, or a direct link to a .mp4 / .webm file.',
      },
      label: 'Video URL',
      validate: ((value, { siblingData }) => {
        if (isUpload(siblingData)) return true
        if (!value) return 'Video URL is required'
        return parseVideoUrl(value) ? true : 'Unsupported video URL'
      }) as TextFieldSingleValidation,
    },
    {
      name: 'video',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => isUpload(siblingData),
      },
      filterOptions: {
        mimeType: { contains: 'video' },
      },
      relationTo: 'media',
      validate: ((value, { siblingData }) => {
        if (!isUpload(siblingData)) return true
        return value ? true : 'Video file is required'
      }) as UploadFieldSingleValidation,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
