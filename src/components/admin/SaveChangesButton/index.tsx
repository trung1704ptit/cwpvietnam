'use client'

import { formatAdminURL } from 'payload/shared'
import React, { useCallback, useRef } from 'react'
import {
  FormSubmit,
  useConfig,
  useDocumentInfo,
  useEditDepth,
  useForm,
  useFormModified,
  useHotkey,
  useLocale,
  useOperation,
  useTranslation,
} from '@payloadcms/ui'

export function SaveChangesButton() {
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const {
    id,
    collectionSlug,
    globalSlug,
    setUnpublishedVersionCount,
    uploadStatus,
  } = useDocumentInfo()
  const modified = useFormModified()
  const { code: locale } = useLocale()
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const { t } = useTranslation()
  const { submit } = useForm()
  const operation = useOperation()
  const disabled = (operation === 'update' && !modified) || uploadStatus === 'uploading'

  const saveChanges = useCallback(async () => {
    if (disabled) return

    const search = `?locale=${locale}&depth=0&fallback-locale=null&draft=true`
    let action: string | undefined
    let method = 'POST'

    if (collectionSlug) {
      action = formatAdminURL({
        apiRoute: api,
        path: `/${collectionSlug}${id ? `/${id}` : ''}${search}`,
      })
      if (id) method = 'PATCH'
    }

    if (globalSlug) {
      action = formatAdminURL({
        apiRoute: api,
        path: `/globals/${globalSlug}${search}`,
      })
    }

    if (!action) return

    await submit({
      action,
      method,
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })

    setUnpublishedVersionCount((count) => count + 1)
  }, [
    api,
    collectionSlug,
    disabled,
    globalSlug,
    id,
    locale,
    setUnpublishedVersionCount,
    submit,
  ])

  useHotkey(
    {
      cmdCtrlKey: true,
      editDepth,
      keyCodes: ['s'],
    },
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      ref.current?.click()
    },
  )

  return (
    <FormSubmit
      buttonId="action-save-changes"
      buttonStyle="secondary"
      className="save-changes"
      disabled={disabled}
      onClick={() => void saveChanges()}
      ref={ref}
      size="medium"
      type="button"
    >
      {t('general:save')}
    </FormSubmit>
  )
}
