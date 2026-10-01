import type { IconBaseProps } from 'react-icons'

import React from 'react'

import { loadIcon } from '@/fields/icon/iconSets'

type Props = IconBaseProps & { value?: string | null }

export const DynamicIcon = async ({ value, ...props }: Props) => {
  const Icon = await loadIcon(value)
  return Icon ? <Icon {...props} /> : null
}
