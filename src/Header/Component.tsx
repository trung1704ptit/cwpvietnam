import { HeaderClient } from './Component.client'
import type { Locale } from '@/i18n/config'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React, { Suspense } from 'react'

export async function Header({ locale }: { locale: Locale }) {
  const headerData = await getCachedGlobal('header', 2, locale)()

  return (
    <Suspense>
      <HeaderClient data={headerData} locale={locale} />
    </Suspense>
  )
}
