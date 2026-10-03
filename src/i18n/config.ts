export const locales = ['en', 'vi'] as const

export type Locale = (typeof locales)[number]

/** Served without a URL prefix; every other locale lives under `/{locale}`. */
export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}
