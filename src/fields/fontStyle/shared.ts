import type { CSSProperties } from 'react'

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 54, 60, 66,
  72, 80, 88, 96, 108, 120,
]

export const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: 'Lato', value: 'var(--font-lato), sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Monospace', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
]

const colorPattern = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i

// Only these declarations from a text node's inline style reach the frontend.
const allowedStyles: Record<string, { key: keyof CSSProperties; isValid: (v: string) => boolean }> =
  {
    'background-color': { key: 'backgroundColor', isValid: (v) => colorPattern.test(v) },
    color: { key: 'color', isValid: (v) => colorPattern.test(v) },
    'font-family': {
      key: 'fontFamily',
      isValid: (v) => FONT_FAMILIES.some((family) => family.value === v),
    },
    'font-size': { key: 'fontSize', isValid: (v) => /^\d+(\.\d+)?(px|rem|em)$/.test(v) },
  }

export const parseTextStyle = (style: unknown): CSSProperties | undefined => {
  if (typeof style !== 'string' || !style) return undefined

  const result: Record<string, string> = {}
  for (const declaration of style.split(';')) {
    const separator = declaration.indexOf(':')
    if (separator === -1) continue
    const property = declaration.slice(0, separator).trim().toLowerCase()
    const value = declaration.slice(separator + 1).trim()
    const allowed = allowedStyles[property]
    if (allowed && allowed.isValid(value)) result[allowed.key] = value
  }

  return Object.keys(result).length ? (result as CSSProperties) : undefined
}
