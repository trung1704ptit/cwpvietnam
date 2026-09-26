'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { isLocale, localeLabels, locales, type Locale } from '@/i18n/config'
import { cn } from '@/utilities/ui'

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  vi: '🇻🇳',
}

export const LocaleSwitcher: React.FC<{
  className?: string
  locale: Locale
}> = ({ className, locale }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChange = (value: string) => {
    if (!isLocale(value) || value === locale) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', value)
    const url = new URL(pathname, window.location.origin)
    url.search = params.toString()
    window.location.assign(url.toString())
  }

  return (
    <Select onValueChange={onChange} value={locale}>
      <SelectTrigger
        aria-label={`Language: ${localeLabels[locale]}`}
        className={cn(
          'h-9 w-14 gap-2 border-white/30 bg-transparent px-2 text-white shadow-none [&>span]:line-clamp-none [&>span]:overflow-visible',
          '[&_svg:not([class*=text-])]:text-white [&_svg]:opacity-80',
          'focus-visible:ring-white/30',
          className,
        )}
      >
        <span aria-hidden="true" className="block text-lg leading-normal">
          {localeFlags[locale]}
        </span>
      </SelectTrigger>
      <SelectContent>
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            <span aria-hidden="true">{localeFlags[code]}</span>
            <span>{localeLabels[code]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
