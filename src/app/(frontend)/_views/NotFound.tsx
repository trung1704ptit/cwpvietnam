import React from 'react'

import { LocalizedLink as Link } from '@/components/LocalizedLink'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

export function NotFound({ locale }: { locale: Locale }) {
  const t = getMessages(locale)

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t.pageNotFound}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{t.goHome}</Link>
      </Button>
    </div>
  )
}
