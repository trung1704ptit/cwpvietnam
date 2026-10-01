'use client'

import type { TextFieldClientComponent } from 'payload'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { mergeFieldStyles } from '@payloadcms/ui/shared'
import React from 'react'

import { DEFAULT_PRIMARY_COLOR, normalizeHexColor } from '@/utilities/themeColor'

const toSixDigitHex = (hex: string) =>
  hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex

export const ColorPickerField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const swatch = toSixDigitHex(normalizeHexColor(value, DEFAULT_PRIMARY_COLOR))

  return (
    <div className="field-type text" style={mergeFieldStyles(field)}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
        <input
          aria-label="Pick color"
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value)}
          style={{
            background: 'none',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s)',
            cursor: readOnly ? 'default' : 'pointer',
            flexShrink: 0,
            height: 40,
            padding: 2,
            width: 48,
          }}
          type="color"
          value={swatch}
        />
        <input
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value.trim())}
          placeholder={field.admin?.placeholder?.toString() ?? 'Default'}
          style={{
            background: 'var(--theme-input-bg)',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-s)',
            color: 'var(--theme-text)',
            flex: 1,
            fontFamily: 'var(--font-mono)',
            height: 40,
            minWidth: 0,
            padding: '0 10px',
          }}
          type="text"
          value={value ?? ''}
        />
      </div>
      <FieldError message={errorMessage} path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
