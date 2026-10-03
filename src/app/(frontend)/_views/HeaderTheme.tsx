'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Theme } from '@/providers/Theme/types'

export const HeaderTheme: React.FC<{ theme: Theme }> = ({ theme }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(theme)
  }, [setHeaderTheme, theme])
  return <React.Fragment />
}
