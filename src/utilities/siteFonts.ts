export const SITE_FONTS = {
  lato: 'Lato',
  beVietnamPro: 'Be Vietnam Pro',
  inter: 'Inter',
  roboto: 'Roboto',
  openSans: 'Open Sans',
  montserrat: 'Montserrat',
  nunito: 'Nunito',
  notoSans: 'Noto Sans',
} as const

export type SiteFontKey = keyof typeof SITE_FONTS

export const DEFAULT_SITE_FONT: SiteFontKey = 'lato'
export const DEFAULT_BASE_FONT_SIZE = 18
export const MIN_BASE_FONT_SIZE = 12
export const MAX_BASE_FONT_SIZE = 24

export const SITE_FONT_OPTIONS = Object.entries(SITE_FONTS).map(([value, label]) => ({
  label,
  value,
}))

export const normalizeSiteFont = (value: unknown): SiteFontKey =>
  typeof value === 'string' && Object.hasOwn(SITE_FONTS, value)
    ? (value as SiteFontKey)
    : DEFAULT_SITE_FONT

export const normalizeBaseFontSize = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(MAX_BASE_FONT_SIZE, Math.max(MIN_BASE_FONT_SIZE, value))
    : DEFAULT_BASE_FONT_SIZE
