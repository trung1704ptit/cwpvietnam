import { defaultLocale, isLocale, locales, type Locale } from './config'

const UNLOCALIZED_PREFIXES = ['/admin', '/api', '/next', '/media', '/_next']

const isUnlocalizedPath = (path: string) =>
  UNLOCALIZED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

export const getPathLocale = (pathname: string | null | undefined): Locale => {
  const firstSegment = pathname?.split('/')[1]
  return isLocale(firstSegment) && firstSegment !== defaultLocale ? firstSegment : defaultLocale
}

/** Removes a locale prefix: `/vi/lien-he` → `/lien-he`, `/vi` → `/`. */
export const stripLocale = (pathname: string): string => {
  const locale = getPathLocale(pathname)
  if (locale === defaultLocale) return pathname

  const rest = pathname.slice(locale.length + 1)
  return rest.startsWith('/') ? rest : `/${rest}`
}

/**
 * Prefixes a site-relative path with the locale segment, e.g. `/lien-he` → `/vi/lien-he`.
 * External URLs, hash/mailto links and backend routes are returned unchanged.
 */
export const localizePath = (path: string, locale: Locale): string => {
  if (!path.startsWith('/') || path.startsWith('//') || isUnlocalizedPath(path)) return path

  const unprefixed = stripLocale(path)
  if (locale === defaultLocale) return unprefixed

  return unprefixed === '/' || /^\/[?#]/.test(unprefixed)
    ? `/${locale}${unprefixed.slice(1)}`
    : `/${locale}${unprefixed}`
}

export const allLocalePaths = (path: string): string[] =>
  locales.map((locale) => localizePath(path, locale))
