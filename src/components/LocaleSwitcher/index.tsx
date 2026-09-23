'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isLocale, localeLabels, locales, type Locale } from '@/i18n/config'
import { cn } from '@/utilities/ui'

export const LocaleSwitcher: React.FC<{
  className?: string
  locale: Locale
}> = ({ className, locale }) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const onChange = (value: string) => {
    if (!isLocale(value) || value === locale) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select onValueChange={onChange} value={locale}>
      <SelectTrigger
        aria-label="Language"
        className={cn(
          'h-9 w-auto min-w-24 gap-2 border-white/30 bg-transparent px-3 text-white shadow-none',
          '[&_svg:not([class*=text-])]:text-white [&_svg]:opacity-80',
          'focus-visible:ring-white/30',
          className,
        )}
      >
        <SelectValue placeholder={localeLabels[locale]} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            {localeLabels[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
