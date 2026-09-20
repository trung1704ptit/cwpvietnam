import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getLocale } from '@/utilities/getLocale'
import React, { Suspense } from 'react'

export async function Header() {
  const locale = await getLocale()
  const headerData = await getCachedGlobal('header', 2, locale)()

  return (
    <Suspense>
      <HeaderClient data={headerData} locale={locale} />
    </Suspense>
  )
}
