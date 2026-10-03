'use client'

import Link from 'next/link'
import React from 'react'

import { localizePath } from '@/i18n/paths'
import { useLocale } from '@/i18n/useLocale'

/** `next/link` that keeps visitors in the language of the page they are on. */
export const LocalizedLink: React.FC<React.ComponentProps<typeof Link>> = ({ href, ...props }) => {
  const locale = useLocale()

  return <Link href={typeof href === 'string' ? localizePath(href, locale) : href} {...props} />
}
