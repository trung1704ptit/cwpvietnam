'use client'
import Link from 'next/link'
import React, { useSyncExternalStore } from 'react'

import type { Header } from '@/payload-types'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import type { Locale } from '@/i18n/config'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  locale: Locale
}

const subscribeToScroll = (callback: () => void) => {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

const getScrollSnapshot = () => window.scrollY > 0
const getServerScrollSnapshot = () => false

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  )

  return (
    <header
      className={cn(
        'z-40 w-full bg-primary text-white shadow-md',
        isScrolled ? 'sticky top-0' : 'relative',
      )}
    >
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
