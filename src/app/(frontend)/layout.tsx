import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
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

async function getThemeColors() {
  try {
    const settings = await getCachedGlobal('settings', 0)()
    const primaryColor = normalizeHexColor(settings?.primaryColor)

    return {
      primaryColor,
      primaryForeground: getContrastingForeground(primaryColor),
    }
  } catch {
    return {
      primaryColor: DEFAULT_PRIMARY_COLOR,
      primaryForeground: DEFAULT_PRIMARY_FOREGROUND,
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { primaryColor, primaryForeground } = await getThemeColors()
  const locale = await getLocale()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root,[data-theme='light'],[data-theme='dark']{--primary:${primaryColor};--primary-foreground:${primaryForeground};--sidebar-primary:${primaryColor};--sidebar-primary-foreground:${primaryForeground};}`,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
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

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
