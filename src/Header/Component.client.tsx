'use client'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import type { Locale } from '@/i18n/config'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  locale: Locale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-white shadow-md">
      <div className="container flex items-center justify-between py-1">
        <Link href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <div className="flex items-center gap-3">
          <HeaderNav data={data} locale={locale} />
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
