import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Lato } from 'next/font/google'
import React from 'react'

const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

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
    <html className={cn(lato.variable)} lang={locale} suppressHydrationWarning>
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
      <body className={cn('font-sans antialiased', lato.className)}>
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
