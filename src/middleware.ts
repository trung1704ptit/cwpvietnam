import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from '@/i18n/config'

const cookieOptions = {
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
  sameSite: 'lax' as const,
}

function detectLocale(request: NextRequest): Locale {
  const accept = request.headers.get('accept-language')?.toLowerCase() || ''

  if (accept.includes('vi')) return 'vi'
  if (accept.includes('en')) return 'en'

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get('locale')
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value

  if (isLocale(localeParam)) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('locale')
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, localeParam, cookieOptions)
    return response
  }

  if (!isLocale(cookieLocale)) {
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, detectLocale(request), cookieOptions)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!admin|api|_next|next|favicon.ico|.*\\..*).*)'],
}
