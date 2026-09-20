export const DEFAULT_PRIMARY_COLOR = '#dd3e60'
export const DEFAULT_PRIMARY_FOREGROUND = '#ffffff'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function normalizeHexColor(value: unknown, fallback = DEFAULT_PRIMARY_COLOR): string {
  if (typeof value === 'string' && HEX_COLOR.test(value)) {
    return value
  }

  return fallback
}

export function getContrastingForeground(hex: string): string {
  const normalized = hex.replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized
  const red = parseInt(full.slice(0, 2), 16)
  const green = parseInt(full.slice(2, 4), 16)
  const blue = parseInt(full.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.55 ? '#111111' : DEFAULT_PRIMARY_FOREGROUND
}
