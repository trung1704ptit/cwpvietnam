'use client'

import { usePathname } from 'next/navigation'

import type { Locale } from './config'
import { getPathLocale } from './paths'

export const useLocale = (): Locale => getPathLocale(usePathname())
