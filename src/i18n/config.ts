export const locales = ['vi', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export const localeLabels: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}

export const LOCALE_COOKIE = 'locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}
