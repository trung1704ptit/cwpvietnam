'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { isLocale, localeLabels, locales, type Locale } from '@/i18n/config'
import { localizePath } from '@/i18n/paths'
import { cn } from '@/utilities/ui'

const localeFlags: Record<Locale, string> = {
  en: 'gb',
  vi: 'vn',
}

const LocaleFlag: React.FC<{ locale: Locale }> = ({ locale }) => (
  <span
    aria-hidden="true"
    className={cn('fi shrink-0 rounded-[2px] text-base', `fi-${localeFlags[locale]}`)}
  />
)

export const LocaleSwitcher: React.FC<{
  className?: string
  locale: Locale
}> = ({ className, locale }) => {
  const pathname = usePathname()

  const onChange = (value: string) => {
    if (!isLocale(value) || value === locale) return

    // Full navigation: each locale has its own root layout.
    window.location.assign(localizePath(pathname, value) + window.location.search)
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
        <LocaleFlag locale={locale} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            <LocaleFlag locale={code} />
            <span>{localeLabels[code]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
