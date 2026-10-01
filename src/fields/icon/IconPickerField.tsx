'use client'

import type { TextFieldClientComponent } from 'payload'
import type { IconType } from 'react-icons'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { mergeFieldStyles } from '@payloadcms/ui/shared'
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react'

import {
  type IconModule,
  iconSets,
  type IconSetKey,
  loadIconSet,
  parseIconValue,
} from './iconSets'

const PAGE_SIZE = 300
const ALL_SETS = 'all'
const setKeys = Object.keys(iconSets) as IconSetKey[]

type SetFilter = IconSetKey | typeof ALL_SETS
type IconEntry = { Icon: IconType; name: string; search: string; set: IconSetKey }

const inputStyle: React.CSSProperties = {
  background: 'var(--theme-input-bg)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-s)',
  color: 'var(--theme-text)',
  height: 36,
  padding: '0 10px',
}

const buttonStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-s)',
  color: 'var(--theme-text)',
  cursor: 'pointer',
  height: 36,
  padding: '0 14px',
}

const toTokens = (query: string) =>
  query
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)

export const IconPickerField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { errorMessage, setValue, showError, value } = useField<string>({ path })
  const selected = parseIconValue(value)
  const selectedSet = selected?.set

  const [isOpen, setIsOpen] = useState(false)
  const [setFilter, setSetFilter] = useState<SetFilter>(ALL_SETS)
  const [loaded, setLoaded] = useState<Partial<Record<IconSetKey, IconModule>>>({})
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const deferredQuery = useDeferredValue(query)

  const visibleSets = useMemo(
    () => (setFilter === ALL_SETS ? setKeys : [setFilter]),
    [setFilter],
  )

  useEffect(() => {
    const needed = new Set<IconSetKey>(selectedSet ? [selectedSet] : [])
    if (isOpen) visibleSets.forEach((key) => needed.add(key))

    needed.forEach((key) => {
      if (loaded[key]) return
      void loadIconSet(key).then((icons) => setLoaded((prev) => ({ ...prev, [key]: icons })))
    })
  }, [isOpen, loaded, selectedSet, visibleSets])

  const entries = useMemo(
    () =>
      visibleSets.flatMap((set) =>
        Object.entries(loaded[set] ?? {}).flatMap(([name, Icon]) =>
          Icon ? [{ Icon, name, search: name.toLowerCase(), set }] : [],
        ),
      ) satisfies IconEntry[],
    [loaded, visibleSets],
  )

  const matches = useMemo(() => {
    const tokens = toTokens(deferredQuery)
    if (!tokens.length) return entries
    return entries.filter(({ search }) => tokens.every((token) => search.includes(token)))
  }, [deferredQuery, entries])

  const isLoading = visibleSets.some((key) => !loaded[key])
  const SelectedIcon = selected ? loaded[selected.set]?.[selected.name] : undefined

  return (
    <div className="field-type text" style={mergeFieldStyles(field)}>
      <FieldLabel label={field.label} path={path} required={field.required} />

      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <div
          style={{
            alignItems: 'center',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-m)',
            display: 'flex',
            height: 56,
            justifyContent: 'center',
            width: 56,
          }}
        >
          {SelectedIcon ? <SelectedIcon size={30} /> : <span style={{ opacity: 0.4 }}>—</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, opacity: selected ? 1 : 0.6 }}>
          {selected ? `${iconSets[selected.set].label} · ${selected.name}` : 'No icon selected'}
        </span>
        {!readOnly && (
          <>
            <button onClick={() => setIsOpen((open) => !open)} style={buttonStyle} type="button">
              {isOpen ? 'Close' : selected ? 'Change icon' : 'Choose icon'}
            </button>
            {selected && (
              <button onClick={() => setValue('')} style={buttonStyle} type="button">
                Clear
              </button>
            )}
          </>
        )}
      </div>

      {isOpen && !readOnly && (
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-m)',
            marginTop: 12,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <select
              aria-label="Icon set"
              onChange={(event) => {
                setSetFilter(event.target.value as SetFilter)
                setLimit(PAGE_SIZE)
              }}
              style={inputStyle}
              value={setFilter}
            >
              <option value={ALL_SETS}>All sets</option>
              {setKeys.map((key) => (
                <option key={key} value={key}>
                  {iconSets[key].label}
                </option>
              ))}
            </select>
            <input
              aria-label="Search icons"
              autoFocus
              onChange={(event) => {
                setQuery(event.target.value)
                setLimit(PAGE_SIZE)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault()
              }}
              placeholder="Search in English, e.g. heart, user, phone, arrow right…"
              style={{ ...inputStyle, flex: '1 1 220px' }}
              type="text"
              value={query}
            />
          </div>

          <div
            onScroll={(event) => {
              const el = event.currentTarget
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200 && limit < matches.length) {
                setLimit((current) => current + PAGE_SIZE)
              }
            }}
            style={{
              display: 'grid',
              gap: 6,
              gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
              maxHeight: 360,
              overflowY: 'auto',
            }}
          >
            {matches.slice(0, limit).map(({ Icon, name, set }) => {
              const isSelected = selected?.set === set && selected.name === name

              return (
                <button
                  aria-label={name}
                  aria-pressed={isSelected}
                  key={`${set}/${name}`}
                  onClick={() => {
                    setValue(`${set}/${name}`)
                    setIsOpen(false)
                  }}
                  style={{
                    alignItems: 'center',
                    aspectRatio: '1',
                    background: isSelected ? 'var(--theme-success-100)' : 'var(--theme-elevation-0)',
                    border: `1px solid ${isSelected ? 'var(--theme-success-500)' : 'var(--theme-elevation-100)'}`,
                    borderRadius: 'var(--style-radius-s)',
                    color: 'var(--theme-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  title={`${name} (${iconSets[set].label})`}
                  type="button"
                >
                  <Icon size={22} />
                </button>
              )
            })}
          </div>

          <p style={{ fontSize: 12, margin: '8px 0 0', opacity: 0.6 }}>
            {isLoading
              ? 'Loading icons…'
              : matches.length
                ? `${matches.length} icons${limit < matches.length ? ' · scroll down to see more' : ''}`
                : 'No icons found. Try another English keyword or icon set.'}
          </p>
        </div>
      )}

      <FieldError message={errorMessage} path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
