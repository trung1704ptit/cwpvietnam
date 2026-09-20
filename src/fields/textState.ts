import { defaultColors } from '@payloadcms/richtext-lexical'

export const textState = {
  color: {
    ...defaultColors.text,
    ...defaultColors.background,
    'text-black': {
      label: 'Black',
      css: { color: '#111111' },
    },
    'text-gray': {
      label: 'Gray',
      css: { color: '#6b7280' },
    },
    'text-white': {
      label: 'White',
      css: { color: '#ffffff' },
    },
    'text-brand': {
      label: 'Brand',
      css: { color: '#dd3e60' },
    },
  },
  fontSize: {
    small: {
      label: 'Small',
      css: { 'font-size': '0.875rem' },
    },
    large: {
      label: 'Large',
      css: { 'font-size': '1.25rem' },
    },
    huge: {
      label: 'Huge',
      css: { 'font-size': '1.75rem' },
    },
  },
  fontFamily: {
    serif: {
      label: 'Serif',
      css: { 'font-family': 'Georgia, "Times New Roman", serif' },
    },
    mono: {
      label: 'Mono',
      css: { 'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
    },
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
      | Record<string, { css?: Record<string, string> }>
      | undefined
    const css = group?.[stateValue]?.css
    if (!css) continue
    Object.assign(style, css)
  }

  return Object.keys(style).length > 0 ? style : undefined
}

