import { defaultColors } from '@payloadcms/richtext-lexical'

type StateOptions = Record<string, { css: Record<string, string>; label: string }>

const withPrefix = (prefix: string, options: StateOptions): StateOptions =>
  Object.fromEntries(
    Object.entries(options).map(([key, option]) => [
      key,
      { ...option, label: `${prefix}: ${option.label}` },
    ]),
  )

// Saved content references these keys, so 14/20/28px keep their original names.
const legacyFontSizeKeys: Record<number, string> = { 14: 'small', 20: 'large', 28: 'huge' }
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64]

// No longer offered in the editor (see `fontStyle`), but saved content may still carry these keys.
export const textState = {
  fontSize: Object.fromEntries(
    fontSizes.map((px) => [
      legacyFontSizeKeys[px] ?? `size-${px}`,
      { label: `Size: ${px}px`, css: { 'font-size': `${px / 16}rem` } },
    ]),
  ),
  fontFamily: withPrefix('Font', {
    serif: {
      label: 'Serif',
      css: { 'font-family': 'Georgia, "Times New Roman", serif' },
    },
    mono: {
      label: 'Mono',
      css: { 'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
    },
  }),
  color: {
    ...withPrefix('Text', {
      'text-black': { label: 'Black', css: { color: '#111111' } },
      'text-gray': { label: 'Gray', css: { color: '#6b7280' } },
      'text-white': { label: 'White', css: { color: '#ffffff' } },
      'text-brand': { label: 'Brand', css: { color: '#dd3e60' } },
      ...(defaultColors.text as StateOptions),
    }),
    ...withPrefix('Background', defaultColors.background as StateOptions),
  },
}

type TextStateNode = {
  $?: Record<string, string | null | undefined>
}

export function getTextStateStyle(node: TextStateNode) {
  const state = node.$
  if (!state) return undefined

  const style: Record<string, string> = {}

  for (const [stateKey, stateValue] of Object.entries(state)) {
    if (!stateValue) continue
    const group = textState[stateKey as keyof typeof textState] as
      Record<string, { css?: Record<string, string> }> | undefined
    const css = group?.[stateValue]?.css
    if (!css) continue
    Object.assign(style, css)
  }

  return Object.keys(style).length > 0 ? style : undefined
}
