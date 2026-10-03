import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'

import { fontVariableClassNames, siteFonts } from './fonts'
import { AdminBar } from '@/components/AdminBar'
import { NavigationProgress } from '@/components/NavigationProgress'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getLocale } from '@/utilities/getLocale'
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_PRIMARY_FOREGROUND,
  getContrastingForeground,
  normalizeHexColor,
} from '@/utilities/themeColor'
import {
  DEFAULT_BASE_FONT_SIZE,
  DEFAULT_SITE_FONT,
  normalizeBaseFontSize,
  normalizeSiteFont,
} from '@/utilities/siteFonts'

async function getSiteTheme() {
  try {
    const settings = await getCachedGlobal('settings', 0)()
    const primaryColor = normalizeHexColor(settings?.primaryColor)

    return {
      baseFontSize: normalizeBaseFontSize(settings?.baseFontSize),
      fontFamily: normalizeSiteFont(settings?.fontFamily),
      primaryColor,
      primaryForeground: getContrastingForeground(primaryColor),
    }
  } catch {
    return {
      baseFontSize: DEFAULT_BASE_FONT_SIZE,
      fontFamily: DEFAULT_SITE_FONT,
      primaryColor: DEFAULT_PRIMARY_COLOR,
      primaryForeground: DEFAULT_PRIMARY_FOREGROUND,
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { baseFontSize, fontFamily, primaryColor, primaryForeground } = await getSiteTheme()
  const locale = await getLocale()

  return (
    <html className={cn(fontVariableClassNames)} lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root,[data-theme='light'],[data-theme='dark']{--primary:${primaryColor};--primary-foreground:${primaryForeground};--sidebar-primary:${primaryColor};--sidebar-primary-foreground:${primaryForeground};}html{--font-site:var(${siteFonts[fontFamily].cssVariable});font-size:${baseFontSize}px;}`,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        <NavigationProgress />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let title = 'Cancer Wellness Program'

  try {
    const settings = await getCachedGlobal('settings', 0)()
    if (settings?.siteTitle?.trim()) {
      title = settings.siteTitle.trim()
    }
  } catch {
    // use default title
  }

  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    openGraph: mergeOpenGraph({ siteName: title, title }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
