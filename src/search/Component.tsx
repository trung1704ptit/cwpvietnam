'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { localizePath, stripLocale } from '@/i18n/paths'
import { useLocale } from '@/i18n/useLocale'
import { useDebounce } from '@/utilities/useDebounce'
import { usePathname, useRouter } from 'next/navigation'

export const Search: React.FC<{
  initialQuery?: string
  live?: boolean
  placeholder?: string
  submitLabel?: string
}> = ({ initialQuery = '', live = false, placeholder = 'Search', submitLabel = 'Search' }) => {
  const [value, setValue] = useState(initialQuery)
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const isSearchPage = live || stripLocale(pathname) === '/search'
  const debouncedValue = useDebounce(value)

  useEffect(() => {
    if (!isSearchPage) return

    const next = debouncedValue ? `/search?q=${encodeURIComponent(debouncedValue)}` : '/search'
    router.replace(localizePath(next, locale))
  }, [debouncedValue, isSearchPage, locale, router])

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!isSearchPage) {
            router.push(localizePath(`/search?q=${encodeURIComponent(value)}`, locale))
          }
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {submitLabel}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={placeholder}
          value={value}
        />
        <button
          className={
            isSearchPage
              ? 'sr-only'
              : 'inline-flex h-9 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground'
          }
          type="submit"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
