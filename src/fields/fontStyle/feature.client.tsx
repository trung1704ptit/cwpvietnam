'use client'

import type { ToolbarGroup, ToolbarGroupItem } from '@payloadcms/richtext-lexical'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import {
  $getSelection,
  $isRangeSelection,
  SKIP_DOM_SELECTION_TAG,
  type BaseSelection,
  type LexicalEditor,
} from '@payloadcms/richtext-lexical/lexical'
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from '@payloadcms/richtext-lexical/lexical/selection'
import React, { useEffect, useState } from 'react'

import { FONT_FAMILIES, FONT_SIZES } from './shared'

type StyleProperty = 'background-color' | 'color' | 'font-family' | 'font-size'

const applyStyle = (
  editor: LexicalEditor,
  patch: Partial<Record<StyleProperty, string | null>>,
  keepFocus = false,
) => {
  editor.update(
    () => {
      const selection = $getSelection()
      if (selection) $patchStyleText(selection, patch)
    },
    // The native color picker closes if Lexical moves DOM focus back to the editor.
    keepFocus ? { tag: SKIP_DOM_SELECTION_TAG } : undefined,
  )
}

const getStyle = (selection: BaseSelection | null, property: StyleProperty) =>
  $isRangeSelection(selection) ? $getSelectionStyleValueForProperty(selection, property, '') : ''

const useSelectionStyle = (editor: LexicalEditor, property: StyleProperty) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    const read = () =>
      editor.getEditorState().read(() => setValue(getStyle($getSelection(), property)))
    read()
    return editor.registerUpdateListener(read)
  }, [editor, property])

  return value
}

const toHex = (value: string, fallback: string) => {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${[...value.slice(1)].map((char) => char + char).join('')}`
  }
  const rgb = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgb) {
    return `#${rgb
      .slice(1, 4)
      .map((channel) => Number(channel).toString(16).padStart(2, '0'))
      .join('')}`
  }
  return fallback
}

const iconStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  fontSize: '13px',
  fontWeight: 600,
  height: '20px',
  justifyContent: 'center',
  minWidth: '20px',
}

const FontSizeIcon = () => (
  <span style={iconStyle}>
    <span style={{ fontSize: '10px' }}>A</span>
    <span style={{ fontSize: '15px' }}>A</span>
  </span>
)

const FontFamilyIcon = () => <span style={{ ...iconStyle, fontFamily: 'Georgia, serif' }}>F</span>

const ColorPicker: React.FC<{
  editor: LexicalEditor
  property: 'background-color' | 'color'
  title: string
}> = ({ editor, property, title }) => {
  const value = useSelectionStyle(editor, property)
  const isBackground = property === 'background-color'

  return (
    <span style={{ alignItems: 'center', display: 'inline-flex' }}>
      <label
        className="toolbar-popup__button"
        style={{ cursor: 'pointer', position: 'relative' }}
        title={title}
      >
        <span
          style={{
            ...iconStyle,
            backgroundColor: isBackground ? value || 'transparent' : undefined,
            borderBottom: isBackground ? undefined : `3px solid ${value || 'currentColor'}`,
            borderRadius: isBackground ? '3px' : undefined,
            outline: isBackground ? '1px solid var(--theme-elevation-250)' : undefined,
          }}
        >
          A
        </span>
        <input
          aria-label={title}
          onChange={(event) => applyStyle(editor, { [property]: event.target.value }, true)}
          style={{ cursor: 'pointer', inset: 0, opacity: 0, position: 'absolute' }}
          type="color"
          value={toHex(value, isBackground ? '#ffff00' : '#000000')}
        />
      </label>
      {value ? (
        <button
          aria-label={`Remove ${title.toLowerCase()}`}
          className="toolbar-popup__button"
          onClick={() => applyStyle(editor, { [property]: null })}
          style={{ fontSize: '14px', minWidth: '16px', padding: '0 2px' }}
          title={`Remove ${title.toLowerCase()}`}
          type="button"
        >
          ×
        </button>
      ) : null}
    </span>
  )
}

const TextColorPicker: ToolbarGroupItem['Component'] = ({ editor }) => (
  <ColorPicker editor={editor} property="color" title="Text color" />
)

const BackgroundColorPicker: ToolbarGroupItem['Component'] = ({ editor }) => (
  <ColorPicker editor={editor} property="background-color" title="Background color" />
)

const styleOption = (
  property: StyleProperty,
  key: string,
  label: string,
  value: string | null,
): ToolbarGroupItem => ({
  isActive: value ? ({ selection }) => getStyle(selection, property) === value : undefined,
  key,
  label,
  onSelect: ({ editor }) => applyStyle(editor, { [property]: value }),
})

const toolbarGroups: ToolbarGroup[] = [
  {
    type: 'dropdown',
    ChildComponent: FontFamilyIcon,
    items: [
      styleOption('font-family', 'font-family-default', 'Default font', null),
      ...FONT_FAMILIES.map(({ label, value }, index) =>
        styleOption('font-family', `font-family-${index}`, label, value),
      ),
    ],
    key: 'fontFamily',
    order: 25,
  },
  {
    type: 'dropdown',
    ChildComponent: FontSizeIcon,
    items: [
      styleOption('font-size', 'font-size-default', 'Default size', null),
      ...FONT_SIZES.map((px) => styleOption('font-size', `font-size-${px}`, `${px}px`, `${px}px`)),
    ],
    key: 'fontSize',
    order: 26,
  },
  {
    type: 'buttons',
    items: [
      { Component: TextColorPicker, key: 'textColor' },
      { Component: BackgroundColorPicker, key: 'backgroundColor' },
    ],
    key: 'fontColor',
    order: 27,
  },
]

export const FontStyleFeatureClient = createClientFeature({
  toolbarFixed: { groups: toolbarGroups },
  toolbarInline: { groups: toolbarGroups },
})
