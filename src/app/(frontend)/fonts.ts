import {
  Be_Vietnam_Pro,
  Inter,
  Lato,
  Montserrat,
  Noto_Sans,
  Nunito,
  Open_Sans,
  Roboto,
} from 'next/font/google'

import type { SiteFontKey } from '@/utilities/siteFonts'

// next/font only accepts literal options, so each font is declared in full.
// Only Lato is preloaded; the others download only when selected in Settings.
const lato = Lato({
  display: 'swap',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-lato',
  weight: ['300', '400', '700'],
})

const beVietnamPro = Be_Vietnam_Pro({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  weight: ['300', '400', '500', '700'],
})

const inter = Inter({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '700'],
})

const roboto = Roboto({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
})

const openSans = Open_Sans({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '700'],
})

const montserrat = Montserrat({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700'],
})

const nunito = Nunito({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '700'],
})

const notoSans = Noto_Sans({
  display: 'swap',
  preload: false,
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '700'],
})

export const siteFonts: Record<SiteFontKey, { className: string; cssVariable: string }> = {
  beVietnamPro: { className: beVietnamPro.variable, cssVariable: '--font-be-vietnam-pro' },
  inter: { className: inter.variable, cssVariable: '--font-inter' },
  lato: { className: lato.variable, cssVariable: '--font-lato' },
  montserrat: { className: montserrat.variable, cssVariable: '--font-montserrat' },
  notoSans: { className: notoSans.variable, cssVariable: '--font-noto-sans' },
  nunito: { className: nunito.variable, cssVariable: '--font-nunito' },
  openSans: { className: openSans.variable, cssVariable: '--font-open-sans' },
  roboto: { className: roboto.variable, cssVariable: '--font-roboto' },
}

export const fontVariableClassNames = Object.values(siteFonts).map((font) => font.className)
